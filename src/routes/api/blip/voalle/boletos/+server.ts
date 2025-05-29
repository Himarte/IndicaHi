import { BLIP_CHAVE_API } from '$env/static/private';
import type { RequestHandler } from './$types';
import {
	validateCpfCnpj,
	getVoalleAccessToken,
	fetchVoalleBoletos
} from '$lib/server/utils/voalle.server';
import {
	createErrorResponse,
	createSuccessResponse,
	validateApiKey
} from '$lib/server/utils/response.server';

// API para buscar boletos em aberto
export const GET: RequestHandler = async ({ request }) => {
	try {
		// Validação da chave de API
		if (!validateApiKey(request, BLIP_CHAVE_API)) {
			return createErrorResponse('Chave de API inválida', 401);
		}

		// Validação e sanitização do CPF/CNPJ
		const cpfCnpjRaw = request.headers.get('CPF-CNPJ');
		const cpfCnpj = validateCpfCnpj(cpfCnpjRaw);

		if (!cpfCnpj) {
			return createErrorResponse('CPF/CNPJ inválido ou não fornecido', 400);
		}

		// Obtenção do token de acesso
		const accessToken = await getVoalleAccessToken();

		// Busca dos boletos em aberto
		const dadosBoletos = await fetchVoalleBoletos(cpfCnpj, accessToken);

		return createSuccessResponse(dadosBoletos, 180); // Cache de 3 minutos
	} catch (error) {
		console.error('Erro no endpoint de boletos Voalle:', error);

		const message = error instanceof Error ? error.message : 'Erro interno do servidor';
		const status = message.includes('autenticação')
			? 502
			: message.includes('não encontrado')
				? 404
				: message.includes('inválido')
					? 400
					: 500;

		return createErrorResponse(message, status);
	}
};
