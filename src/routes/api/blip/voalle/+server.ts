import {
	BLIP_CHAVE_API,
	BLIP_VOALLE_CLIENT_ID,
	BLIP_VOALLE_CLIENT_SECRET,
	VOALLE_SYNDATA_API,
	VOALLE_URL
} from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	if (request.headers.get('API-KEY-BLIP') !== BLIP_CHAVE_API) {
		return new Response('Chave de API inválida', { status: 401 });
	}
	const cpfCnpj = request.headers.get('CPF-CNPJ');
	if (!cpfCnpj) {
		return new Response('Parâmetros inválidos', { status: 400 });
	}

	// Faz a requisição para para pegar o access token
	const autentificacaoVoalle = await fetch(`${VOALLE_URL}:45700/connect/token`, {
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
	}).then((res) => res.json());

	const accessToken = autentificacaoVoalle.access_token;

	const response = await fetch(
		`${VOALLE_URL}:45715/external/integrations/thirdparty/people/txid/${cpfCnpj}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	);

	if (!response.ok) {
		console.error(`HTTP error status: ${response.status}`);
		const errorText = await response.text();
		return new Response(errorText, { status: response.status });
	}

	const dadosClienteVoalle = await response.json();

	return new Response(JSON.stringify(dadosClienteVoalle), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
