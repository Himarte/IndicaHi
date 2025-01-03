import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

const statusMap = {
	aguardando: 'Aguardando Pagamento',
	pagos: 'Pago'
};

export const GET: RequestHandler = async ({ request, params }) => {
	if (!validateApiKey(request)) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	const status = statusMap[params.status as keyof typeof statusMap];

	if (!status) {
		return new Response('Status inválido', { status: 400 });
	}

	try {
		const leads = await db
			.select()
			.from(leadsTable)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq(leadsTable.status, status as any));

		return new Response(JSON.stringify(leads), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Erro ao buscar leads:', error);
		return new Response('Erro interno do servidor', { status: 500 });
	}
};
