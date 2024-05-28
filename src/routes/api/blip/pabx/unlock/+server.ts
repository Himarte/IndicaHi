import { BLIP_CHAVE_API, VOALLE_URL, TOKEN_PABX } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// Verifica se a chave da API é válida
	if (request.headers.get('API-KEY-BLIP') !== BLIP_CHAVE_API) {
		return new Response('Chave de API inválida', { status: 401 });
	}

	// Obtém os cabeçalhos CPF-CNPJ e CELULAR-CLIENTE
	const cpfCnpj = request.headers.get('CPF-CNPJ');
	const celularCliente = request.headers.get('CELULAR-CLIENTE');

	// Verifica se os cabeçalhos necessários estão presentes
	if (!cpfCnpj || !celularCliente) {
		return new Response('Parâmetros inválidos', { status: 400 });
	}

	// console.log('CPF/CNPJ:', cpfCnpj, 'Celular:', celularCliente);

	// Faz a requisição para obter o access token
	const autentificacao = await fetch(`${VOALLE_URL}/pbx/pbx/events/new/CLIENT_VALIDATE`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			codigo: cpfCnpj,
			callerid: celularCliente,
			token: TOKEN_PABX
		})
	}).then((res) => res.json());

	// Verifica se o cliente foi encontrado
	if (!autentificacao.clients || !autentificacao.clients[0]) {
		return new Response('Cliente não encontrado', { status: 404 });
	}

	// Obtém a lista de IDs de contratos do cliente
	const contractsIds = autentificacao.clients[0].contracts_id;

	// console.log('Contratos ID:', contractsIds);

	// Verifica se há mais de um contrato
	if (contractsIds.length > 1) {
		// Array para armazenar os resultados das requisições UNBLOCK_CONTRACT
		const unlockResults = await Promise.all(
			contractsIds.map(async (contractId: number) => {
				const unlockContrato = await fetch(`${VOALLE_URL}/pbx/pbx/events/new/UNBLOCK_CONTRACT`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						data_unblock_contract: contractId.toString(),
						token: TOKEN_PABX
					})
				}).then((res) => res.json());

				// console.log('Unlock Contratos ID:', contractId, 'Resposta:', unlockContrato);
				return unlockContrato;
			})
		);

		// Verifica o resultado da primeira tentativa de desbloqueio
		if (unlockResults[0].return === true) {
			return new Response(
				`Desbloqueio realizado com sucesso, número do protocolo ${unlockResults[0].protocol}`,
				{ status: 200 }
			);
		} else if (unlockResults[0].return === false) {
			return new Response('Não possui contrato bloqueado', { status: 400 });
		} else {
			return new Response('Não possui contrato bloqueado', { status: 500 });
		}
	} else {
		// Caso haja apenas um contrato, faz a requisição de desbloqueio para ele
		const unlockContrato = await fetch(`${VOALLE_URL}/pbx/pbx/events/new/UNBLOCK_CONTRACT`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				data_unblock_contract: contractsIds[0].toString(),
				token: TOKEN_PABX
			})
		}).then((res) => res.json());

		console.log('Unlock Contratos ID:', contractsIds[0], 'Resposta:', unlockContrato);

		// Verifica o resultado da tentativa de desbloqueio
		if (unlockContrato.return === true) {
			return new Response(
				`Desbloqueio realizado com sucesso, número do protocolo ${unlockContrato.protocol}`,
				{ status: 200 }
			);
		} else if (unlockContrato.return === false) {
			return new Response('Não possui contrato bloqueado', { status: 400 });
		} else {
			return new Response('Não possui contrato bloqueado', { status: 500 });
		}
	}
};
