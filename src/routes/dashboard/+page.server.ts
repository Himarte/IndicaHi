import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { eq, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const userPromoCode = locals?.user?.promoCode;

	if (!userPromoCode) {
		return {
			leads: {
				pendentes: [],
				emAtendimento: [],
				finalizados: [],
				cancelados: []
			},
			message: 'Usuário não autenticado ou sem promoCode'
		};
	}

	try {
		const allLeads = await db
			.select()
			.from(leadsTable)
			.where(eq(leadsTable.promoCode, userPromoCode));

		return {
			leads: {
				pendentes: allLeads.filter((lead) => lead.status === 'Pendente'),
				emAtendimento: allLeads.filter((lead) => lead.status === 'Sendo Atendido'),
				finalizados: allLeads.filter((lead) => lead.status === 'Finalizado'),
				cancelados: allLeads.filter((lead) => lead.status === 'Cancelado')
			}
		};
	} catch (err) {
		console.error('Erro ao buscar leads:', err);
		return {
			leads: {
				pendentes: [],
				emAtendimento: [],
				finalizados: [],
				cancelados: []
			},
			message: 'Erro interno do servidor'
		};
	}
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
				| 'Cancelado';

			if (!['Pendente', 'Sendo Atendido', 'Finalizado', 'Pago', 'Cancelado'].includes(status)) {
				return fail(400, {
					success: false,
					message: 'Status inválido'
				});
			}

			const lead = await db
				.select()
				.from(leadsTable)
				.where(and(eq(leadsTable.id, id), eq(leadsTable.promoCode, locals.user.promoCode)));

			if (!lead || lead.length === 0) {
				return fail(404, {
					success: false,
					message: 'Lead não encontrado ou não autorizado'
				});
			}

			await db.update(leadsTable).set({ status }).where(eq(leadsTable.id, id));

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
