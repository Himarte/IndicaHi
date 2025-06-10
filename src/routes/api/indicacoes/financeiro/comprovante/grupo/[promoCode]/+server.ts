import { error } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { grupoPagamentoTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const [grupo] = await db
			.select({
				comprovante: grupoPagamentoTable.comprovante,
				status: grupoPagamentoTable.status
			})
			.from(grupoPagamentoTable)
			.where(eq(grupoPagamentoTable.promoCode, params.promoCode))
			.limit(1);

		if (!grupo) {
			throw error(404, 'Grupo de pagamento não encontrado');
		}

		if (grupo.status !== 'Pago') {
			throw error(400, 'Grupo não possui comprovante de pagamento');
		}

		if (!grupo.comprovante) {
			throw error(404, 'Comprovante não encontrado para este grupo');
		}

		return new Response(JSON.stringify({ comprovante: grupo.comprovante }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Erro ao buscar comprovante do grupo:', err);
		throw error(500, 'Erro ao buscar comprovante do grupo');
	}
};
