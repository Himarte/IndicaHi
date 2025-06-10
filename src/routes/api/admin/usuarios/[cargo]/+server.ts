import { SITE_CHAVE_API } from '$env/static/private';
import { userTable } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

const cargoMap = {
	vendedores_internos: 'Vendedor Interno',
	vendedores_externos: 'Vendedor Externo',
	administrador: 'Admin',
	financeiro: 'Financeiro'
};

export const GET: RequestHandler = async ({ request, locals, params }) => {
	if (!validateApiKey(request)) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	if (!locals.user?.job?.includes('Admin')) {
		return new Response('Usuário não autorizado', { status: 403 });
	}

	const cargo = cargoMap[params.cargo as keyof typeof cargoMap];

	if (!cargo) {
		return new Response('Cargo inválido', { status: 400 });
	}

	try {
		const usuarios = await db
			.select()
			.from(userTable)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.where(eq(userTable.job, cargo as any));

		return new Response(JSON.stringify(usuarios), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Erro ao buscar usuários:', error);
		return new Response('Erro interno do servidor', { status: 500 });
	}
};
