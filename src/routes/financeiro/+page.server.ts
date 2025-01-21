import type { Actions, PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { leadsComprovanteTable, leadsTable } from '$lib/server/database/schema';
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
	updateStatus: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				success: false,
				message: 'Não autorizado'
			});
		}

		try {
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const status = formData.get('status') as string;
			const comprovante = formData.get('comprovante') as File;

			// Validação do status
			if (!['Aguardando Pagamento', 'Pago', 'Cancelado'].includes(status)) {
				return fail(400, {
					success: false,
					message: 'Status inválido para operação financeira'
				});
			}

			// Validação do comprovante
			const validarComprovante = (arquivo: File) => {
				if (!arquivo) return 'Comprovante é obrigatório';
				const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
				if (!tiposPermitidos.includes(arquivo.type)) return 'Formato de arquivo inválido';
				const maxSize = 5 * 1024 * 1024; // 5MB
				if (arquivo.size > maxSize) return 'Arquivo deve ter no máximo 5MB';
				return null;
			};

			const erroComprovante = validarComprovante(comprovante);
			if (erroComprovante) {
				return fail(400, {
					success: false,
					message: erroComprovante
				});
			}

			// Processamento do comprovante
			const processarComprovante = async (arquivo: File) => {
				const buffer = await arquivo.arrayBuffer();
				const base64 = Buffer.from(buffer).toString('base64');
				return `data:${arquivo.type};base64,${base64}`;
			};

			// Busca o lead
			const lead = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
			if (!lead || lead.length === 0) {
				return fail(404, {
					success: false,
					message: 'Lead não encontrado'
				});
			}

			// Atualiza o status do lead
			await db.transaction(async (tx) => {
				await tx
					.update(leadsTable)
					.set({
						status: status as 'Aguardando Pagamento' | 'Pago',
						pagoPor: locals.user?.name,
						pagoEm: status === 'Pago' ? new Date().toISOString() : null,
						aguardandoPagamentoEm:
							status === 'Aguardando Pagamento' ? new Date().toISOString() : null
					})
					.where(eq(leadsTable.id, id));

				// Salva o comprovante em tabela separada
				if (status === 'Pago') {
					const comprovanteBase64 = await processarComprovante(comprovante);
					await tx.insert(leadsComprovanteTable).values({
						id: crypto.randomUUID(),
						leadsId: id,
						comprovante: comprovanteBase64
					});
				}
			});

			return {
				success: true,
				message: 'Status atualizado com sucesso'
			};
		} catch (error) {
			console.error('Erro ao atualizar status:', error);
			return fail(500, {
				success: false,
				message: 'Erro ao atualizar status'
			});
		}
	}
};
