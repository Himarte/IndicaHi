import type { Actions, PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import {
	leadsComprovanteTable,
	leadsTable,
	userTable,
	motivoCancelado,
	grupoPagamentoTable
} from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user) {
		return fail(401, {
			success: false,
			message: 'Não autorizado'
		});
	}

	const fetchLeadsByStatus = async (status: string) => {
		try {
			const response = await fetch(`/api/indicacoes/financeiro/${status}`, {
				method: 'GET',
				headers: {
					'API-KEY': SITE_CHAVE_API,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Erro ao buscar leads ${status}`);
			}

			return await response.json();
		} catch (err) {
			console.error(`Erro ao buscar leads ${status}:`, err);
			return [];
		}
	};

	const [aguardandoPagamento, pagos] = await Promise.all([
		fetchLeadsByStatus('aguardando'),
		fetchLeadsByStatus('pagos')
	]);

	return {
		leads: {
			aguardandoPagamento,
			pagos
		}
	};
};

export const actions: Actions = {
	updateStatusGrupo: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { success: false, message: 'Não autorizado' });
		}

		if (locals.user.job !== 'Financeiro') {
			return fail(403, {
				success: false,
				message: 'Apenas usuários do Financeiro podem processar pagamentos em grupo'
			});
		}

		try {
			const formData = await request.formData();
			const promoCode = formData.get('promoCode') as string;
			const status = formData.get('status') as string;
			const comprovante = formData.get('comprovante') as File | null;
			const motivo = formData.get('motivo') as string | null;

			// Capturar dados do formulário
			const dadosGrupo = {
				promoCode,
				status,
				valorTotal: formData.get('valorTotal'),
				bonusIndicacaoResgatado: formData.get('bonusIndicacaoResgatado'),
				valorTotalFinal: formData.get('valorTotalFinal'),
				vendedorNome: formData.get('vendedorNome'),
				vendedorTelefone: formData.get('vendedorTelefone'),
				vendedorPixCode: formData.get('vendedorPixCode'),
				vendedorPixType: formData.get('vendedorPixType'),
				clientesData: formData.get('clientesData'),
				quantidadeClientes: formData.get('quantidadeClientes')
			};

			// console.log('FORM DATA COMPLETO:', dadosGrupo);

			// Validações básicas
			if (!['Pago', 'Cancelado'].includes(status)) {
				return fail(400, { success: false, message: 'Status inválido para operação de grupo' });
			}

			// Buscar leads do grupo
			const leadsDoGrupo = await db
				.select()
				.from(leadsTable)
				.where(eq(leadsTable.promoCode, promoCode));

			if (!leadsDoGrupo.length) {
				return fail(404, { success: false, message: 'Nenhum lead encontrado para este grupo' });
			}

			// console.log(`=== PROCESSANDO ${status.toUpperCase()} - ${leadsDoGrupo.length} leads ===`);

			// Validações específicas por status
			const validacao = validarOperacao(status, motivo, comprovante);
			if (validacao.erro) {
				return fail(400, { success: false, message: validacao.erro });
			}

			// Processar comprovante se necessário
			const comprovanteBase64 = comprovante ? await processarComprovante(comprovante) : null;

			const now = new Date().toISOString();

			// Executar transação
			await db.transaction(async (tx) => {
				// Atualizar todos os leads
				await atualizarLeadsGrupo(
					tx,
					leadsDoGrupo,
					status,
					now,
					locals.user?.name,
					motivo,
					comprovanteBase64
				);

				// Criar registro do grupo
				const grupoPagamentoData = criarDadosGrupoPagamento(
					dadosGrupo,
					leadsDoGrupo,
					status,
					now,
					locals.user?.name,
					motivo,
					comprovanteBase64
				);

				await tx.insert(grupoPagamentoTable).values(grupoPagamentoData);
			});

			const acao = status === 'Pago' ? 'processado' : 'cancelado';
			return {
				success: true,
				message: `Grupo "${promoCode}" ${acao} com sucesso! ${leadsDoGrupo.length} leads foram ${acao}s.`,
				newStatus: status
			};
		} catch (error) {
			console.error('Erro ao processar grupo:', error);
			return fail(500, { success: false, message: 'Erro ao processar status do grupo' });
		}
	}
};

// Funções auxiliares
function validarOperacao(status: string, motivo: string | null, comprovante: File | null) {
	if (status === 'Cancelado' && (!motivo || motivo.trim() === '')) {
		return { erro: 'Motivo é obrigatório para cancelamentos' };
	}

	if (status === 'Pago') {
		if (!comprovante || comprovante.size === 0) {
			return { erro: 'Comprovante é obrigatório para pagamentos' };
		}

		const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
		if (!tiposPermitidos.includes(comprovante.type)) {
			return { erro: 'Formato de arquivo inválido. Use JPG, PNG, WEBP ou PDF' };
		}

		if (comprovante.size > 5 * 1024 * 1024) {
			return { erro: 'Arquivo deve ter no máximo 5MB' };
		}
	}

	return { erro: null };
}

async function processarComprovante(arquivo: File): Promise<string> {
	const buffer = await arquivo.arrayBuffer();
	const base64 = Buffer.from(buffer).toString('base64');
	return `data:${arquivo.type};base64,${base64}`;
}

async function atualizarLeadsGrupo(
	tx: any, // eslint-disable-line @typescript-eslint/no-explicit-any
	leads: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
	status: string,
	now: string,
	userName: string | undefined,
	motivo: string | null,
	comprovanteBase64: string | null
) {
	for (const lead of leads) {
		// Atualizar status do lead
		const updateData: { status: string; pagoEm?: string; pagoPor?: string; canceladoEm?: string } =
			{
				status
			};

		if (status === 'Pago') {
			updateData.pagoEm = now;
			updateData.pagoPor = userName;
		} else {
			updateData.canceladoEm = now;
		}

		await tx.update(leadsTable).set(updateData).where(eq(leadsTable.id, lead.id));

		// Ações específicas por status
		if (status === 'Cancelado') {
			await tx.insert(motivoCancelado).values({
				id: crypto.randomUUID(),
				motivo: motivo!,
				leadId: lead.id
			});

			// Decrementar bônus do indicador
			if (lead.userIdPromoCode) {
				const usuarioIndicador = await tx
					.select()
					.from(userTable)
					.where(eq(userTable.id, lead.userIdPromoCode));
				if (usuarioIndicador.length > 0) {
					const novoBonusIndicacao = Math.max(0, (usuarioIndicador[0].bonusIndicacao || 0) - 1);
					await tx
						.update(userTable)
						.set({ bonusIndicacao: novoBonusIndicacao })
						.where(eq(userTable.id, lead.userIdPromoCode));
				}
			}
		} else if (status === 'Pago' && comprovanteBase64) {
			await tx.insert(leadsComprovanteTable).values({
				id: crypto.randomUUID(),
				leadsId: lead.id,
				comprovante: comprovanteBase64
			});
		}
	}
}

function criarDadosGrupoPagamento(
	dadosGrupo: any, // eslint-disable-line @typescript-eslint/no-explicit-any
	leads: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
	status: string,
	now: string,
	userName: string | undefined,
	motivo: string | null,
	comprovanteBase64: string | null
) {
	return {
		id: crypto.randomUUID(),
		promoCode: dadosGrupo.promoCode,
		valorIndicacao: parseInt(dadosGrupo.valorTotal as string) || 0,
		valorBonus: parseInt(dadosGrupo.bonusIndicacaoResgatado as string) || 0,
		valorTotal: parseInt(dadosGrupo.valorTotalFinal as string) || 0,
		status: status as 'Pago' | 'Cancelado',
		motivo: status === 'Cancelado' ? motivo : null,
		vendedorId: leads[0]?.userIdPromoCode || null,
		vendedorNome: (dadosGrupo.vendedorNome as string) || null,
		vendedorTelefone: (dadosGrupo.vendedorTelefone as string) || null,
		vendedorPixCode: (dadosGrupo.vendedorPixCode as string) || null,
		vendedorPixType: (dadosGrupo.vendedorPixType as 'cpf' | 'cnpj') || null,
		leadsIds: JSON.stringify(leads.map((lead) => lead.id)),
		quantidadeLeads: leads.length,
		clientesData: dadosGrupo.clientesData as string,
		processadoEm: now,
		processadoPor: userName || null,
		comprovante: comprovanteBase64
	};
}
