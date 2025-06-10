import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { leadsComprovanteTable, leadsTable } from '$lib/server/database/schema';
import { eq, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return new Response('Não autorizado', { status: 401 });
	}

	try {
		const leadId = params.id;

		// Para vendedores externos (dashboard), verificar se o lead pertence ao seu promoCode
		const userPromoCode = locals.user.promoCode;

		if (!userPromoCode) {
			return json({ error: 'Usuário sem código promocional válido' }, { status: 403 });
		}

		// Verificar se o lead pertence ao vendedor antes de buscar o comprovante
		const lead = await db
			.select({ id: leadsTable.id, promoCode: leadsTable.promoCode })
			.from(leadsTable)
			.where(and(eq(leadsTable.id, leadId), eq(leadsTable.promoCode, userPromoCode)))
			.limit(1);

		if (!lead || lead.length === 0) {
			return json({ error: 'Lead não encontrado ou acesso não autorizado' }, { status: 404 });
		}

		// Buscar comprovante do lead
		const comprovante = await db
			.select()
			.from(leadsComprovanteTable)
			.where(eq(leadsComprovanteTable.leadsId, leadId))
			.limit(1);

		if (!comprovante || comprovante.length === 0) {
			return json({ error: 'Comprovante não encontrado' }, { status: 404 });
		}

		return json({ comprovante: comprovante[0].comprovante });
	} catch (error) {
		console.error('Erro ao buscar comprovante:', error);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
};
