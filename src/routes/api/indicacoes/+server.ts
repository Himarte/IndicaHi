import type { RequestHandler } from './$types';
import { CHAVE_API_SITE } from '$env/static/private';
import { generateId } from 'lucia';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { getUserIdByPromoCode } from '$lib/server/database/utils/user.server';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ url, request }) => {
	// Verifica se a chave da API é válida
	if (request.headers.get('API-KEY') !== CHAVE_API_SITE) {
		return new Response('Chave de API inválida', { status: 401 });
	}
	const id = generateId(10);
	const fullName = url.searchParams.get('fullName');
	// TODO: Verificar se o CPF/CNPJ é válido e se nao esta cadastrado
	const cpfCnpj = url.searchParams.get('cpfCnpj');
	const promoCode = url.searchParams.get('promoCode');

	if (!fullName || !cpfCnpj) {
		return new Response('Parâmetros inválidos', { status: 400 });
	}

	// Verifica se o promoCode vazio ou inválido
	if (!promoCode) {
		await db.insert(leadsTable).values({
			id,
			fullName,
			cpfCnpj,
			promoCode
		});
		return new Response('Lead criado com sucesso sem promocode', { status: 201 });
	}

	const userIdPromoCode = await getUserIdByPromoCode(promoCode);
	if (!userIdPromoCode) {
		return new Response('Código promocional inválido', { status: 400 });
	}
	await db.insert(leadsTable).values({
		id,
		fullName,
		cpfCnpj,
		promoCode,
		userIdPromoCode
	});

	return new Response('Lead criado com sucesso com promocode', { status: 201 });
};

export const GET: RequestHandler = async ({ request, locals }) => {
	// Verifica se a chave da API é válida
	console.log('Na API de indicacoes');

	if (request.headers.get('API-KEY') !== CHAVE_API_SITE) {
		return new Response('Chave de API inválida', { status: 401 });
	}
	if (!locals.user) {
		return new Response('Usuário não autenticado', { status: 401 });
	}

	const leads = await db
		.select({
			id: leadsTable.id,
			fullName: leadsTable.fullName,
			status: leadsTable.status,
			promoCode: leadsTable.promoCode
		})
		.from(leadsTable)
		.where(eq(leadsTable.userIdPromoCode, locals.user.id));

	return new Response(JSON.stringify(leads), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
