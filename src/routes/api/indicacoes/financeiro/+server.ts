import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable, userTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';

export const GET: RequestHandler = async ({ request, locals }) => {
	// Verifica se a chave da API é válida
	console.log('Na API do Dashboard Financeiro');

	if (request.headers.get('API-KEY') !== SITE_CHAVE_API) {
		return new Response('Chave de API inválida', { status: 401 });
	}
	if (!locals.user) {
		return new Response('Usuário não autenticado', { status: 401 });
	}

	const leadsPendente = await db
		.select({
			leadId: leadsTable.id,
			idUserIndicador: leadsTable.userIdPromoCode,
			status: leadsTable.status,
			dataAtendido: leadsTable.attendedAt,
			dataCriado: leadsTable.createdAt,
			userId: userTable.id,
			fullName: userTable.name,
			cpfCnpj: userTable.cpf,
			telefone: userTable.telefone,
			email: userTable.email,
			pixType: userTable.pixType,
			pixKey: userTable.pixCode
		})
		.from(leadsTable)
		.leftJoin(userTable, eq(leadsTable.userIdPromoCode, userTable.id))
		.where(eq(leadsTable.status, 'Pendente'));

	console.log('Leads Pendente Financeiro: ', leadsPendente.length);

	if (leadsPendente.length === 0) {
		return new Response('Nenhum lead Pendente', { status: 404 });
	}

	const userIndicadoresLeads = leadsPendente.map((lead) => ({
		id: lead.userId,
		fullName: lead.fullName,
		cpfCnpj: lead.cpfCnpj,
		telefone: lead.telefone,
		email: lead.email,
		pixType: lead.pixType,
		pixKey: lead.pixKey,
		dataAtendido: lead.dataAtendido,
		dataCriado: lead.dataCriado,
		status: lead.status
	}));

	// console.log('User indicadores: ', userIndicadoresLeads);

	return new Response(JSON.stringify(userIndicadoresLeads), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
