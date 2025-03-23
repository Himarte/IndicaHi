import type { Actions, PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { leadsTable, motivoCancelado } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchLeadsByStatus = async (status: string) => {
		try {
			const response = await fetch(`/api/indicacoes/interno/${status}`, {
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

	const [pendentes, emAtendimento, finalizados, pagos, cancelados] = await Promise.all([
		fetchLeadsByStatus('pendentes'),
		fetchLeadsByStatus('atendimento'),
		fetchLeadsByStatus('finalizados'),
		fetchLeadsByStatus('pagos'),
		fetchLeadsByStatus('cancelados')
	]);

	return {
		leads: {
			pendentes,
			emAtendimento,
			finalizados: [...finalizados, ...pagos],
			cancelados
		}
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				success: false,
				message: 'Não autorizado'
			});
		}

		try {
			// Obtém os dados do formulário
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const status = formData.get('status') as string;
			const motivo = formData.get('motivo') as string;

			// Valida os campos recebidos
			if (!id || !status) {
				return fail(400, {
					success: false,
					message: 'ID ou status ausente.'
				});
			}

			// Busca o lead no banco de dados
			const lead = await db.select().from(leadsTable).where(eq(leadsTable.id, id));

			if (!lead || lead.length === 0) {
				return fail(404, {
					success: false,
					message: 'Lead não encontrado ou não autorizado'
				});
			}

			// Atualiza o status do lead
			const validStatuses = [
				'Cancelado',
				'Pendente',
				'Sendo Atendido',
				'Finalizado',
				'Pago',
				'Aguardando Pagamento'
			] as const;

			if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
				return fail(400, {
					success: false,
					message: 'Status inválido.'
				});
			}

			// Preparar os dados para atualização com os timestamps apropriados
			const updateData: {
				status: (typeof validStatuses)[number];
				atendidoPor: string;
				atendidoEm?: string;
				finalizadoEm?: string;
				pagoEm?: string;
				aguardandoPagamentoEm?: string;
				canceladoEm?: string | null;
			} = {
				status: status as (typeof validStatuses)[number],
				atendidoPor: locals.user.name
			};

			// Atualizar o timestamp correspondente ao status atual
			const now = new Date().toISOString();
			if (status === 'Sendo Atendido') {
				updateData.atendidoEm = now;
			} else if (status === 'Finalizado') {
				updateData.finalizadoEm = now;
			} else if (status === 'Pago') {
				updateData.pagoEm = now;
			} else if (status === 'Aguardando Pagamento') {
				updateData.aguardandoPagamentoEm = now;
			} else if (status === 'Cancelado') {
				updateData.canceladoEm = now;
			}

			// Atualiza o status do lead
			await db.update(leadsTable).set(updateData).where(eq(leadsTable.id, id));

			// Se o status for "Cancelado", salva o motivo na tabela `motivo_cancelado`
			if (status === 'Cancelado' && motivo) {
				// Verificar se já existe um motivo para este lead
				const motivoExistente = await db
					.select()
					.from(motivoCancelado)
					.where(eq(motivoCancelado.leadId, id));

				if (motivoExistente.length > 0) {
					// Se já existe um motivo, atualiza
					await db.update(motivoCancelado).set({ motivo }).where(eq(motivoCancelado.leadId, id));
				} else {
					// Se não existe, insere um novo
					await db.insert(motivoCancelado).values({
						id: crypto.randomUUID(), // Gera um UUID para o registro
						motivo,
						leadId: id // Relaciona o motivo com o lead
					});
				}
			}

			return {
				success: true,
				message: `Status atualizado para ${status} com sucesso.`,
				newStatus: status
			};
		} catch (error) {
			console.error('Erro ao atualizar status:', error);
			return fail(500, {
				success: false,
				message: 'Erro ao atualizar status.'
			});
		}
	}
};
