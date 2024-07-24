import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable, type LeadsSchema } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

// Function to validate API key
const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

export const GET: RequestHandler = async ({ request, locals }) => {
	console.log('Na API do Dashboard Vendedor Interno');

	// Validate API key
	if (!validateApiKey(request)) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	// Ensure user is authenticated
	if (!locals.user) {
		return new Response('Usuário não autenticado', { status: 401 });
	}

	const LeadsInternos: LeadsSchema[] = await db
		.select({
			id: leadsTable.id,
			fullName: leadsTable.fullName,
			status: leadsTable.status,
			cpfCnpj: leadsTable.cpfCnpj,
			dataAtendido: leadsTable.attendedAt,
			dataCriado: leadsTable.createdAt
		})
		.from(leadsTable)
		.where(eq(leadsTable.status, 'Pendente'));

	console.log('Leads Pendente Vendedor interno: ', LeadsInternos.length);

	return new Response(JSON.stringify(LeadsInternos), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
