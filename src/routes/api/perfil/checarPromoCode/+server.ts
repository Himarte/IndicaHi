import { promoCodeIsUsed } from '$lib/server/database/utils/user.server';
import type { RequestHandler } from './$types';

const createResponse = (message: string, status: number = 200) => {
	return new Response(JSON.stringify({ message }), {
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const dados = await request.formData();
		const promoCode = dados.get('promoCode') as string;

		if (!promoCode || promoCode.length < 3) {
			return createResponse('Código promocional inválido - Mínimo de 3 caracteres', 400);
		}

		const promoCodeUsed = await promoCodeIsUsed(promoCode);
		console.log('Código promocional usado?', promoCodeUsed);

		if (promoCodeUsed) {
			return createResponse('Código promocional inválido', 400);
		}

		return createResponse('Código promocional válido');
	} catch (error) {
		console.error('Erro ao verificar o código promocional:', error);
		return createResponse('Erro interno do servidor', 500);
	}
};
