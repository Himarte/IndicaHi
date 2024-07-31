import type { RequestHandler } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { generateId } from 'lucia';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import {
	cnpjIsUsed,
	cpfIsUsed,
	getUserIdByPromoCode
} from '$lib/server/database/utils/user.server';

// Função para validar a chave da API
const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

// Função para validar formato de CPF/CNPJ
const isValidCpfCnpj = async (cpf: string | null, cnpj: string | null): Promise<boolean> => {
	if (!cpf && !cnpj) return false; // Ambos não podem ser nulos

	const checks: Promise<boolean>[] = [];

	if (cpf && cpf.length === 11) {
		checks.push(cpfIsUsed(cpf));
	}

	if (cnpj && cnpj.length === 14) {
		checks.push(cnpjIsUsed(cnpj));
	}

	const results = await Promise.all(checks);

	return results.every((result) => result);
};

export const POST: RequestHandler = async ({ url, request }) => {
	if (!validateApiKey(request)) {
		return new Response(JSON.stringify({ message: 'Chave de API inválida' }), { status: 401 });
	}

	try {
		const id = generateId(10);
		const fullName = url.searchParams.get('fullName');
		const cpf = url.searchParams.get('cpf');
		const cnpj = url.searchParams.get('cnpj');
		const promoCode = url.searchParams.get('promoCode');
		const telefone = url.searchParams.get('telefone');
		const planoNome = url.searchParams.get('planoNome');
		const planoModelo = url.searchParams.get('planoModelo');
		const planoMegas = url.searchParams.get('planoMegas');

		// Valida parâmetros obrigatórios
		if (!fullName || !telefone) {
			return new Response(JSON.stringify({ message: 'Parâmetros inválidos' }), { status: 400 });
		}

		// Valida formato de CPF/CNPJ
		if (!isValidCpfCnpj(cpf, cnpj)) {
			return new Response(JSON.stringify({ message: 'CPF/CNPJ inválido' }), { status: 400 });
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const commonValues: any = {
			id,
			fullName,
			cpf,
			cnpj,
			telefone,
			planoNome,
			planoModelo,
			planoMegas,
			criadoEm: new Date().toISOString()
		};
		console.log('commonValues:', commonValues);

		if (!promoCode) {
			await db.insert(leadsTable).values(commonValues);
			return new Response(JSON.stringify({ message: 'Lead criado com sucesso sem promocode' }), {
				status: 201
			});
		}

		const userIdPromoCode = await getUserIdByPromoCode(promoCode);
		console.log('userIdPromoCode:', userIdPromoCode);

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
