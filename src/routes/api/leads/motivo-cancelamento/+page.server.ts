import { db } from '$lib/server/database/db.server';
import { motivoCancelado, leadsTable } from '$lib/server/database/schema';
import { eq, and } from 'drizzle-orm';
import type { Actions } from './$types';

export const actions: Actions = {
	fetchMotivo: async ({ request }) => {
		const formData = await request.formData();
		const leadId = formData.get('leadId') as string;

		if (!leadId) {
			return {
				success: false,
				message: 'ID do lead não fornecido',
				motivo: null
			};
		}

		try {
			const result = await db
				.select({
					lead: leadsTable,
					motivo: motivoCancelado.motivo
				})
				.from(leadsTable)
				.leftJoin(
					motivoCancelado,
					and(eq(motivoCancelado.leadId, leadsTable.id), eq(leadsTable.status, 'Cancelado'))
				)
				.where(eq(leadsTable.id, leadId))
				.limit(1);

			if (!result || result.length === 0) {
				return {
					success: false,
					message: 'Lead não encontrado ou não está cancelado',
					motivo: null
				};
			}

			const { motivo } = result[0];

			return {
				success: true,
				message: 'Motivo encontrado com sucesso',
				motivo: motivo
			};
		} catch (error) {
			console.error('Erro ao buscar motivo do cancelamento:', error);
			return {
				success: false,
				message: 'Erro ao buscar motivo do cancelamento',
				motivo: null
			};
		}
	}
};
