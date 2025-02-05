import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { motivoCancelado, leadsTable } from '$lib/server/database/schema';
import { eq, and } from 'drizzle-orm';

export async function GET({ params }) {
	try {
		const leadId = params.id;

		// Busca o lead e seu motivo de cancelamento em uma única consulta
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
			return json(
				{
					success: false,
					message: 'Lead não encontrado ou não está cancelado',
					motivo: null
				},
				{ status: 404 }
			);
		}

		const { motivo } = result[0];

		return json({
			success: true,
			message: 'Motivo encontrado com sucesso',
			motivo: motivo
		});
	} catch (error) {
		console.error('Erro ao buscar motivo do cancelamento:', error);
		return json(
			{
				success: false,
				message: 'Erro ao buscar motivo do cancelamento',
				motivo: null
			},
			{ status: 500 }
		);
	}
}
