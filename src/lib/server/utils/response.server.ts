/**
 * Cria resposta de erro padronizada
 */
export const createErrorResponse = (message: string, status: number) => {
	return new Response(
		JSON.stringify({
			success: false,
			message,
			timestamp: new Date().toISOString()
		}),
		{
			status,
			headers: { 'Content-Type': 'application/json' }
		}
	);
};

/**
 * Cria resposta de sucesso padronizada
 */
export const createSuccessResponse = (data: any, cacheMaxAge?: number) => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	if (cacheMaxAge) {
		headers['Cache-Control'] = `private, max-age=${cacheMaxAge}`;
	}

	return new Response(
		JSON.stringify({
			success: true,
			data,
			timestamp: new Date().toISOString()
		}),
		{
			status: 200,
			headers
		}
	);
};

/**
 * Valida chave de API genérica
 */
export const validateApiKey = (request: Request, expectedKey: string): boolean => {
	const providedKey = request.headers.get('API-KEY') || request.headers.get('API-KEY-BLIP');
	return providedKey === expectedKey;
};
