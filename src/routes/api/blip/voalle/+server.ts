import { CHAVE_API_BLIP, CHAVE_API_VOALLE, URL_VOALLE } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	if (request.headers.get('API-KEY-BLIP') !== CHAVE_API_BLIP) {
		return new Response('Chave de API inválida', { status: 401 });
	}
	const cpfCnpj = request.headers.get('CPF-CNPJ');
	if (!cpfCnpj) {
		return new Response('Parâmetros inválidos', { status: 400 });
	}

	console.log(cpfCnpj);

	const clienteVoalle = await fetch(
		`${URL_VOALLE}:45715/external/integrations/thirdparty/people/txid/${cpfCnpj}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${CHAVE_API_VOALLE}`
			}
		}
	);

	console.log(clienteVoalle);

	// valida se o cliente retornou algo ou deu erro
	if (!clienteVoalle.ok) {
		return new Response('Erro ao buscar cliente', { status: 500 });
	}

	return new Response(
		JSON.stringify({
			clienteVoalle
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
