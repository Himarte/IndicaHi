import { CHAVE_API_BLIP } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	if (request.headers.get('API-KEY-BLIP') !== CHAVE_API_BLIP) {
		return new Response('Chave de API inválida', { status: 401 });
	}
	const cpfCnpj = request.headers.get('CPF-CNPJ');

	if (!cpfCnpj) {
		return new Response('Parâmetros inválidos', { status: 400 });
	}

	const teste = 'Isso vai vir do Voalle';

	return new Response(
		JSON.stringify({
			teste
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
