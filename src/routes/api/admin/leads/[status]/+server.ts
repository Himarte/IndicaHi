import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import { SITE_CHAVE_API } from '$env/static/private';

const statusMap = {
	pendentes: 'Pendente',
	'em-atendimento': 'Sendo Atendido',
	'aguardando-pagamento': 'Aguardando Pagamento',
	pagos: 'Pago',
	finalizados: 'Finalizado',
	cancelados: 'Cancelado'
} as const;

type StatusMapKey = keyof typeof statusMap;
type StatusMapValue = (typeof statusMap)[StatusMapKey];

export const GET: RequestHandler = async ({ params, request }) => {
	const apiKey = request.headers.get('API-KEY');

	if (apiKey !== SITE_CHAVE_API) {
		return new Response('Não autorizado', { status: 401 });
	}

	const status = params.status;
	const mappedStatus = statusMap[status as StatusMapKey] as StatusMapValue;

	if (!mappedStatus) {
		return new Response('Status inválido', { status: 400 });
	}
	try {
		// Limita resultados iniciais para evitar sobrecarga
		const leads = await db
			.select()
			.from(leadsTable)
			.where(eq(leadsTable.status, mappedStatus))
			.limit(50);

		return json(leads, {
			headers: {
				'Cache-Control': 'private, max-age=30' // Cache de 30 segundos
			}
		});
	} catch (error) {
		console.error('Erro ao buscar leads:', error);
		return new Response('Erro interno do servidor', { status: 500 });
	}
};
