import {
	BLIP_VOALLE_CLIENT_ID,
	BLIP_VOALLE_CLIENT_SECRET,
	VOALLE_SYNDATA_API,
	VOALLE_URL
} from '$env/static/private';

// Tipos para melhor type safety
export interface VoalleTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface VoalleErrorResponse {
	error: string;
	error_description?: string;
}

// Cache simples para o token (em produção, considere usar Redis)
let tokenCache: {
	token: string;
	expiresAt: number;
} | null = null;

/**
 * Valida e sanitiza o CPF/CNPJ
 */
export const validateCpfCnpj = (cpfCnpj: string | null): string | null => {
	if (!cpfCnpj) return null;

	// Remove caracteres especiais
	const cleaned = cpfCnpj.replace(/\D/g, '');

	// Valida se é CPF (11 dígitos) ou CNPJ (14 dígitos)
	if (cleaned.length !== 11 && cleaned.length !== 14) {
		return null;
	}

	return cleaned;
};

/**
 * Obtém um token de acesso válido (com cache)
 */
export const getVoalleAccessToken = async (): Promise<string> => {
	// Verifica se o token em cache ainda é válido (com margem de 5 minutos)
	if (tokenCache && tokenCache.expiresAt > Date.now() + 5 * 60 * 1000) {
		return tokenCache.token;
	}

	try {
		const response = await fetch(`${VOALLE_URL}:45700/connect/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				scope: 'syngw',
				client_id: BLIP_VOALLE_CLIENT_ID,
				client_secret: BLIP_VOALLE_CLIENT_SECRET,
				syndata: VOALLE_SYNDATA_API
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Erro na autenticação Voalle: ${response.status} - ${errorText}`);
			throw new Error(`Falha na autenticação: ${response.status}`);
		}

		const tokenData: VoalleTokenResponse = await response.json();

		if (!tokenData.access_token) {
			throw new Error('Token de acesso não recebido');
		}

		// Atualiza o cache
		tokenCache = {
			token: tokenData.access_token,
			expiresAt: Date.now() + tokenData.expires_in * 1000
		};

		return tokenData.access_token;
	} catch (error) {
		console.error('Erro ao obter token de acesso:', error);
		throw new Error('Falha na autenticação com Voalle');
	}
};

/**
 * Busca dados do cliente na API Voalle
 */
export const fetchVoalleClientData = async (cpfCnpj: string, accessToken: string) => {
	try {
		const response = await fetch(
			`${VOALLE_URL}:45715/external/integrations/thirdparty/people/txid/${cpfCnpj}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Erro na consulta Voalle: ${response.status} - ${errorText}`);

			// Tratamento específico para diferentes códigos de erro
			switch (response.status) {
				case 401:
					throw new Error('Token de acesso inválido');
				case 404:
					throw new Error('Cliente não encontrado');
				case 429:
					throw new Error('Muitas requisições. Tente novamente em alguns minutos');
				default:
					throw new Error(`Erro na consulta: ${response.status}`);
			}
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Erro desconhecido na consulta');
	}
};

/**
 * Busca boletos em aberto na API Voalle
 */
export const fetchVoalleBoletos = async (cpfCnpj: string, accessToken: string) => {
	try {
		const response = await fetch(
			`${VOALLE_URL}:45715/external/integrations/thirdparty/getopentitlesbytxid/${cpfCnpj}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Erro na consulta de boletos Voalle: ${response.status} - ${errorText}`);

			switch (response.status) {
				case 401:
					throw new Error('Token de acesso inválido');
				case 404:
					throw new Error('Nenhum boleto encontrado para este cliente');
				case 429:
					throw new Error('Muitas requisições. Tente novamente em alguns minutos');
				default:
					throw new Error(`Erro na consulta de boletos: ${response.status}`);
			}
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Erro desconhecido na consulta de boletos');
	}
};

/**
 * Limpa o cache do token (útil para forçar renovação)
 */
export const clearVoalleTokenCache = (): void => {
	tokenCache = null;
};
