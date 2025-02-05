import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { leadsComprovanteTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return new Response('Não autorizado', { status: 401 });
	}

	try {
		const comprovante = await db
			.select()
			.from(leadsComprovanteTable)
			.where(eq(leadsComprovanteTable.leadsId, params.id))
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
