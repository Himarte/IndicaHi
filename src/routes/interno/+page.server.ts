import type { Actions, PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
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
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const status = formData.get('status') as
				| 'Pendente'
				| 'Sendo Atendido'
				| 'Finalizado'
				| 'Pago'
				| 'Cancelado'
				| 'Aguardando Pagamento';

			if (
				![
					'Pendente',
					'Sendo Atendido',
					'Finalizado',
					'Pago',
					'Cancelado',
					'Aguardando Pagamento'
				].includes(status)
			) {
				return fail(400, {
					success: false,
					message: 'Status inválido'
				});
			}

			const lead = await db.select().from(leadsTable).where(eq(leadsTable.id, id));

			if (!lead || lead.length === 0) {
				return fail(404, {
					success: false,
					message: 'Lead não encontrado ou não autorizado'
				});
			}

			await db
				.update(leadsTable)
				.set({
					status,
					atendidoPor: locals.user.name,
					...(status === 'Aguardando Pagamento'
						? { aguardandoPagamentoEm: new Date().toISOString() }
						: status === 'Sendo Atendido'
							? { atendidoEm: new Date().toISOString() }
							: status === 'Finalizado'
								? { finalizadoEm: new Date().toISOString() }
								: status === 'Cancelado'
									? { canceladoEm: new Date().toISOString() }
									: {})
				})
				.where(eq(leadsTable.id, id));

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
