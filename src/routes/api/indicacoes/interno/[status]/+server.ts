import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable, type LeadsSchema } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

const statusMap = {
	pendentes: 'Pendente',
	atendimento: 'Sendo Atendido',
	finalizados: 'Finalizado',
	cancelados: 'Cancelado',
	pagos: 'Pago'
};

export const GET: RequestHandler = async ({ request, locals, params }) => {
	if (!validateApiKey(request)) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	if (!locals.user) {
		return new Response('Usuário não autenticado', { status: 401 });
	}

	const status = statusMap[params.status as keyof typeof statusMap];

	if (!status) {
		return new Response('Status inválido', { status: 400 });
	}

	const leads: LeadsSchema[] = await db
		.select()
		.from(leadsTable)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.where(eq(leadsTable.status, status as any));

	return new Response(JSON.stringify(leads), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
