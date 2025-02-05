import { eq } from 'drizzle-orm';
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

	if (cpf && cpf.length === 11) {
		const isUsed = await cpfIsUsed(cpf);
		if (isUsed) return false; // CPF já está em uso
	}

	if (cnpj && cnpj.length === 14) {
		const isUsed = await cnpjIsUsed(cnpj);
		if (isUsed) return false; // CNPJ já está em uso
	}

	return true; // CPF/CNPJ válido (não está em uso)
};

const validateRequiredFields = (data: {
	fullName: string | null;
	telefone: string | null;
	planoNome?: string | null;
	planoModelo?: string | null;
	planoMegas?: number;
}) => {
	if (!data.fullName || !data.telefone) {
		return 'Nome e telefone são obrigatórios';
	}
	return null;
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
		const planoMegas = parseInt(url.searchParams.get('planoMegas') || '0', 10);

		const validationError = validateRequiredFields({
			fullName,
			telefone,
			planoNome,
			planoModelo,
			planoMegas
		});

		if (validationError) {
			return new Response(JSON.stringify({ message: validationError }), { status: 400 });
		}

		// Valida formato de CPF/CNPJ
		if (!(await isValidCpfCnpj(cpf, cnpj))) {
			return new Response(JSON.stringify({ message: 'CPF/CNPJ inválido' }), { status: 400 });
		}

		// Construção de commonValues
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
			criadoEm: new Date().toISOString(),
			atendidoEm: null,
			pagoEm: null,
			canceladoEm: null
		};

		// Se o promoCode estiver presente e válido, adicionamos ao commonValues
		if (promoCode) {
			const userIdPromoCode = await getUserIdByPromoCode(promoCode);

			if (!userIdPromoCode) {
				return new Response(JSON.stringify({ message: 'Código promocional inválido' }), {
					status: 400
				});
			}

			commonValues.promoCode = promoCode;
			commonValues.userIdPromoCode = userIdPromoCode;
		}

		// Inserção no banco de dados
		await db.insert(leadsTable).values(commonValues);

		return new Response(JSON.stringify({ message: 'Lead criado com sucesso' }), {
			status: 201
		});
	} catch (error) {
		console.error('Error creating lead:', error);
		return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
	}
};
export const GET: RequestHandler = async ({ locals }) => {
	const userPromoCode = locals?.user?.promoCode;

	if (!userPromoCode) {
		return new Response(JSON.stringify({ message: 'Usuário não autenticado ou sem promoCode' }), {
			status: 401
		});
	}

	try {
		const leads = await db.select().from(leadsTable).where(eq(leadsTable.promoCode, userPromoCode));

		return new Response(JSON.stringify(leads), { status: 200 });
	} catch (error) {
		console.error('Erro ao buscar leads:', error);
		return new Response(JSON.stringify({ message: 'Erro interno do servidor' }), { status: 500 });
	}
};
