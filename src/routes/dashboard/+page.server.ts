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
				aguardandoPagamento: [],
				pagos: [],
				cancelados: []
			},
			message: 'Usuário não autenticado ou sem promoCode'
		};
	}

	try {
		// Select all leads from the user without the comprovante
		const allLeads = await db
			.select()
			.from(leadsTable)
			.where(eq(leadsTable.promoCode, userPromoCode));

		return {
			leads: {
				pendentes: allLeads.filter((lead) => lead.status === 'Pendente'),
				emAtendimento: allLeads.filter((lead) => lead.status === 'Sendo Atendido'),
				aguardandoPagamento: allLeads.filter((lead) => lead.status === 'Aguardando Pagamento'),
				pagos: allLeads.filter((lead) => lead.status === 'Pago'),
				cancelados: allLeads.filter((lead) => lead.status === 'Cancelado')
			}
		};
	} catch (err) {
		console.error('Erro ao buscar leads:', err);
		return {
			leads: {
				pendentes: [],
				emAtendimento: [],
				aguardandoPagamento: [],
				pagos: [],
				cancelados: []
			},
			message: 'Erro interno do servidor'
		};
	}
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		// Validação de autenticação
		if (!locals.user) {
			return fail(401, {
				success: false,
				message: 'Usuário não autenticado'
			});
		}

		// Validação de promoCode
		if (!locals.user.promoCode) {
			return fail(403, {
				success: false,
				message: 'Usuário sem código promocional válido'
			});
		}

		try {
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const status = formData.get('status') as string;

			// Validação de campos obrigatórios
			if (!id || !status) {
				return fail(400, {
					success: false,
					message: 'ID e status são obrigatórios'
				});
			}

			// Validação do formato do ID
			if (typeof id !== 'string' || id.trim().length === 0) {
				return fail(400, {
					success: false,
					message: 'ID inválido'
				});
			}

			// Validação do status
			const validStatuses = [
				'Pendente',
				'Sendo Atendido',
				'Aguardando Pagamento',
				'Pago',
				'Cancelado'
			] as const;
			type ValidStatus = (typeof validStatuses)[number];

			if (!validStatuses.includes(status as ValidStatus)) {
				return fail(400, {
					success: false,
					message: `Status inválido. Status válidos: ${validStatuses.join(', ')}`
				});
			}

			const lead = await db
				.select()
				.from(leadsTable)
				.where(
					and(eq(leadsTable.id, id), eq(leadsTable.promoCode, locals.user.promoCode as string))
				);

			if (!lead || lead.length === 0) {
				return fail(404, {
					success: false,
					message: 'Lead não encontrado ou não autorizado'
				});
			}

			await db
				.update(leadsTable)
				.set({ status: status as ValidStatus })
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
