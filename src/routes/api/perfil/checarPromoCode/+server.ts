import { promoCodeIsUsed } from '$lib/server/database/utils/user.server';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const dados = await request.formData();
	const promoCode = dados.get('promoCode') as string;

	const promoCodeUsed = await promoCodeIsUsed(promoCode);
	console.log(promoCodeUsed);

	if (promoCodeUsed) {
		return new Response(
			JSON.stringify({
				message: 'Código promocional inválido'
			}),
			{
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} else {
		return new Response(
			JSON.stringify({
				message: 'Código promocional válido'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
