import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { generateId } from 'lucia';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { getUserIdByPromoCode } from '$lib/server/database/utils/user.server';

// Função para validar a chave da API
const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
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

// Função para validar dígitos verificadores do CPF
function validarCPF(cpf: string): boolean {
	// Remove caracteres não numéricos tipo . e - e espacoes e verifica se o cpf tem 11 digitos
	cpf = cpf.replace(/[.-]/g, '').replace(/\s/g, '');

	if (cpf.length !== 11) return false;

	return true;
}

// Função para validar dígitos verificadores do CNPJ
function validarCNPJ(cnpj: string): boolean {
	// Remove caracteres não numéricos tipo . e - e espacoes e verifica se o cnpj tem 14 digitos
	cnpj = cnpj.replace(/[.-]/g, '').replace(/\s/g, '');

	if (cnpj.length !== 14) return false;

	return true;
}

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

		console.log(
			'fullName',
			fullName,
			'telefone',
			telefone,
			'planoNome',
			planoNome,
			'planoModelo',
			planoModelo,
			'planoMegas',
			planoMegas,
			'promoCode',
			promoCode,
			'cpf',
			cpf,
			'cnpj',
			cnpj
		);

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

		// Implementação da validação
		const cpfLimpo = cpf?.replace(/\D/g, '');
		const cnpjLimpo = cnpj?.replace(/\D/g, '');

		// Verifica se pelo menos um dos documentos foi fornecido
		if (!cpfLimpo && !cnpjLimpo) {
			return new Response(JSON.stringify({ message: 'É necessário fornecer CPF ou CNPJ' }), {
				status: 400
			});
		}

		// Valida CPF se fornecido
		if (cpfLimpo) {
			if (cpfLimpo.length !== 11) {
				return new Response(JSON.stringify({ message: 'CPF inválido: deve conter 11 dígitos' }), {
					status: 400
				});
			}
			if (!validarCPF(cpfLimpo)) {
				return new Response(
					JSON.stringify({ message: 'CPF inválido: dígitos verificadores incorretos' }),
					{ status: 400 }
				);
			}
		}

		// Valida CNPJ se fornecido
		if (cnpjLimpo) {
			if (cnpjLimpo.length !== 14) {
				return new Response(JSON.stringify({ message: 'CNPJ inválido: deve conter 14 dígitos' }), {
					status: 400
				});
			}
			if (!validarCNPJ(cnpjLimpo)) {
				return new Response(
					JSON.stringify({ message: 'CNPJ inválido: dígitos verificadores incorretos' }),
					{ status: 400 }
				);
			}
		}

		// Se chegou até aqui, pelo menos um documento é válido
		const documentoValido = {
			cpf: cpfLimpo || null,
			cnpj: cnpjLimpo || null
		};

		// Validar o telefone, limpando os caracteres especiais tipo () - . e espaços
		const telefoneLimpo = telefone?.replace(/[()\-.\s]/g, '');
		if (!telefoneLimpo || telefoneLimpo.length !== 11) {
			return new Response(JSON.stringify({ message: 'Telefone inválido' }), { status: 400 });
		}

		// Construção de commonValues
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const commonValues: any = {
			id,
			fullName,
			cpf: documentoValido.cpf,
			cnpj: documentoValido.cnpj,
			telefone: telefoneLimpo,
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
