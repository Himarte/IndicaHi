import type { RequestHandler } from './$types';
import { CHAVE_API_SITE } from '$env/static/private';
import { generateId } from 'lucia';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';

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
	const newLead = await db.insert(leadsTable).values({
		id,
		fullName,
		cpfCnpj,
		promoCode
	});

	if (!newLead) {
		return new Response('Erro ao criar lead', { status: 500 });
	}
	return new Response('Lead criado com sucesso', { status: 201 });
};
