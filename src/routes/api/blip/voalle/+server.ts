import {
	CHAVE_API_BLIP,
	CLIENT_ID_VOALLE,
	CLIENT_SECRET_VOALLE,
	SYNDATA_API_VOALLE,
	URL_VOALLE
} from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	if (request.headers.get('API-KEY-BLIP') !== CHAVE_API_BLIP) {
		return new Response('Chave de API inválida', { status: 401 });
	}
	const cpfCnpj = request.headers.get('CPF-CNPJ');
	if (!cpfCnpj) {
		return new Response('Parâmetros inválidos', { status: 400 });
	}

	console.log('CPF/CNPJ:', cpfCnpj);

	// Faz a requisição para para pegar o access token
	const autentificacaoVoalle = await fetch(`${URL_VOALLE}:45700/connect/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			scope: 'syngw',
			client_id: CLIENT_ID_VOALLE,
			client_secret: CLIENT_SECRET_VOALLE,
			syndata: SYNDATA_API_VOALLE
		})
	}).then((res) => res.json());

	const accessToken = autentificacaoVoalle.access_token;

	const response = await fetch(
		`${URL_VOALLE}:45715/external/integrations/thirdparty/people/txid/${cpfCnpj}`,
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
	console.log('Response dadosClienteVoalle:', dadosClienteVoalle);

	return new Response(JSON.stringify(dadosClienteVoalle), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
