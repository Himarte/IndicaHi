import { SITE_CHAVE_API } from '$env/static/private';
import { userTable } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';
import type { PageData } from '../../../../admin/listas/administradores/types';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

export const GET: RequestHandler = async ({ request, locals }) => {
	try {
		if (!validateApiKey(request)) {
			return new Response(JSON.stringify({ error: 'Chave de API inválida', administradores: [] }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (!locals.user || locals.user.job !== 'Admin') {
			return new Response(JSON.stringify({ error: 'Não autorizado', administradores: [] }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const administradores = await db
			.select({
				id: userTable.id,
				name: userTable.name,
				email: userTable.email,
				telefone: userTable.telefone,
				cpf: userTable.cpf,
				criadoEm: userTable.criadoEm
			})
			.from(userTable)
			.where(eq(userTable.job, 'Admin'));

		const response: PageData = {
			administradores,
			error: null
		};

		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Erro ao buscar administradores:', error);
		return new Response(
			JSON.stringify({
				error: 'Erro interno do servidor',
				administradores: []
			} satisfies PageData),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
