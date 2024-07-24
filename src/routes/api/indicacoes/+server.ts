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
	// Basic example: check length (11 for CPF, 14 for CNPJ)
	return cpfCnpj.length === 11 || cpfCnpj.length === 14;
};

export const POST: RequestHandler = async ({ url, request }) => {
	if (!validateApiKey(request)) {
		return new Response(JSON.stringify({ message: 'Chave de API inválida' }), { status: 401 });
	}

	try {
		const id = generateId(10);
		const fullName = url.searchParams.get('fullName');
		const cpfCnpj = url.searchParams.get('cpfCnpj');
		const promoCode = url.searchParams.get('promoCode');

		// Validate required parameters
		if (!fullName || !cpfCnpj) {
			return new Response(JSON.stringify({ message: 'Parâmetros inválidos' }), { status: 400 });
		}

		// Validate CPF/CNPJ format
		if (!isValidCpfCnpj(cpfCnpj)) {
			return new Response(JSON.stringify({ message: 'CPF/CNPJ inválido' }), { status: 400 });
		}

		const commonValues = {
			id,
			fullName,
			cpfCnpj,
			promoCode,
			createdAt: new Date().toISOString(),
			attendedAt: null,
			finalizedAt: null,
			paidAt: null
		};

		if (!promoCode) {
			await db.insert(leadsTable).values(commonValues);
			return new Response(JSON.stringify({ message: 'Lead criado com sucesso sem promocode' }), {
				status: 201
			});
		}

		const userIdPromoCode = await getUserIdByPromoCode(promoCode);
		if (!userIdPromoCode) {
			return new Response(JSON.stringify({ message: 'Código promocional inválido' }), {
				status: 400
			});
		}

		await db.insert(leadsTable).values({ ...commonValues, userIdPromoCode });
		return new Response(JSON.stringify({ message: 'Lead criado com sucesso com promocode' }), {
			status: 201
		});
	} catch (error) {
		console.error('Error creating lead:', error);
		return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
	}
};

export const GET: RequestHandler = async ({ request, locals }) => {
	if (!validateApiKey(request)) {
		return new Response(JSON.stringify({ message: 'Chave de API inválida' }), { status: 401 });
	}

	if (!locals.user) {
		return new Response(JSON.stringify({ message: 'Usuário não autenticado' }), { status: 401 });
	}

	try {
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
	} catch (error) {
		console.error('Error fetching leads:', error);
		return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
	}
};
