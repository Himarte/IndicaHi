import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable, type LeadsSchema } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

// Função para validar a chave API
const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

export const GET: RequestHandler = async ({ request, locals }) => {
	console.log('Na API do Dashboard Vendedor Interno');

	// Validar chave API
	if (!validateApiKey(request)) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	// Garantir que o usuário esteja autenticado
	if (!locals.user) {
		return new Response('Usuário não autenticado', { status: 401 });
	}

	const LeadsInternos: LeadsSchema[] = await db
		.select({
			id: leadsTable.id,
			fullName: leadsTable.fullName,
			status: leadsTable.status,
			cpf: leadsTable.cpf,
			cnpj: leadsTable.cnpj,
			dataAtendido: leadsTable.atendidoEm,
			dataCriado: leadsTable.atendidoEm,
			telefone: leadsTable.telefone,
			planoNome: leadsTable.planoNome,
			planoModelo: leadsTable.planoModelo,
			planoMegas: leadsTable.planoMegas
		})
		.from(leadsTable)
		.where(eq(leadsTable.status, 'Pendente'));

	// console.log('Leads Pendente Vendedor interno: ', LeadsInternos);

	console.log('Leads Pendente Vendedor interno: ', LeadsInternos.length);

	return new Response(JSON.stringify(LeadsInternos), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
