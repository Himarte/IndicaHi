import { SITE_CHAVE_API } from '$env/static/private';
import { userTable } from '$lib/server/database/schema';
import { db } from '$lib/server/database/db.server';
import { eq, desc, and, like, sql } from 'drizzle-orm';
import type { VendedoresExternosResponse } from '../../../../admin/listas/vendedores-externos/types';
import type { RequestHandler } from '@sveltejs/kit';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

export const GET: RequestHandler = async ({ request, locals }) => {
	try {
		if (!validateApiKey(request)) {
			return new Response(JSON.stringify({ error: 'Chave de API inválida', vendedores: [] }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (!locals.user || locals.user.job !== 'Admin') {
			return new Response(JSON.stringify({ error: 'Não autorizado', vendedores: [] }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const search = url.searchParams.get('search') || '';

		const offset = (page - 1) * limit;

		// Consulta para contar total de registros
		const totalCount = await db
			.select({ count: sql<number>`count(*)` })
			.from(userTable)
			.where(
				and(
					eq(userTable.job, 'Vendedor Externo'),
					search ? like(userTable.name, `%${search}%`) : undefined
				)
			);

		// Consulta paginada
		const vendedoresExternos = await db
			.select({
				id: userTable.id,
				name: userTable.name,
				email: userTable.email,
				telefone: userTable.telefone,
				cpf: userTable.cpf,
				criadoEm: userTable.criadoEm,
				promoCode: userTable.promoCode
			})
			.from(userTable)
			.where(
				and(
					eq(userTable.job, 'Vendedor Externo'),
					search ? like(userTable.name, `%${search}%`) : undefined
				)
			)
			.orderBy(desc(userTable.criadoEm))
			.limit(limit)
			.offset(offset);

		const totalPages = Math.ceil(totalCount[0].count / limit);

		const response: VendedoresExternosResponse = {
			vendedores: vendedoresExternos,
			pagination: {
				currentPage: page,
				totalPages,
				totalItems: totalCount[0].count,
				itemsPerPage: limit
			},
			error: null
		};

		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Erro ao buscar vendedores externos:', error);
		return new Response(
			JSON.stringify({
				error: 'Erro interno do servidor',
				vendedores: [],
				pagination: {
					currentPage: 1,
					totalPages: 0,
					totalItems: 0,
					itemsPerPage: 10
				}
			} satisfies VendedoresExternosResponse),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
