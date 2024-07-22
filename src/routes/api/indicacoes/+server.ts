import type { RequestHandler } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { generateId } from 'lucia';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { getUserIdByPromoCode } from '$lib/server/database/utils/user.server';
import { eq } from 'drizzle-orm';

// Function to validate API key
const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

// Function to validate CPF/CNPJ format
const isValidCpfCnpj = (cpfCnpj: string | null): boolean => {
	if (!cpfCnpj) return false;
	// Add your CPF/CNPJ validation logic here
	return true;
};

export const POST: RequestHandler = async ({ url, request }) => {
	// Validate API key
	if (!validateApiKey(request)) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	const id = generateId(10);
	const fullName = url.searchParams.get('fullName');
	const cpfCnpj = url.searchParams.get('cpfCnpj');
	const promoCode = url.searchParams.get('promoCode');

	// Validate required parameters
	if (!fullName || !cpfCnpj) {
		return new Response('Parâmetros inválidos', { status: 400 });
	}

	// Validate CPF/CNPJ format
	if (!isValidCpfCnpj(cpfCnpj)) {
		return new Response('CPF/CNPJ inválido', { status: 400 });
	}

	console.log('PromoCode:', promoCode);

	// Handle lead creation without promo code
	if (!promoCode) {
		await db.insert(leadsTable).values({
			id,
			fullName,
			cpfCnpj,
			promoCode
		});
		return new Response('Lead criado com sucesso sem promocode', { status: 201 });
	}

	// Validate promo code
	const userIdPromoCode = await getUserIdByPromoCode(promoCode);
	if (!userIdPromoCode) {
		return new Response('Código promocional inválido', { status: 400 });
	}

	// Insert lead with promo code
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
	// Validate API key
	if (!validateApiKey(request)) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	// Ensure user is authenticated
	if (!locals.user) {
		return new Response('Usuário não autenticado', { status: 401 });
	}

	console.log('Fetching os leads para os users:', locals.user.id);

	// Fetch leads for the authenticated user
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
