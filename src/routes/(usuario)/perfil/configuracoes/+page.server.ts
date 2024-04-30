/* eslint-disable @typescript-eslint/no-explicit-any */
import { userTable } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;
// if (email !== locals.user?.email) {
// 	const emailUsed = await emailIsUsed(email);
// 	if (emailUsed) {
// 		return fail(400, {
// 			status: 400,
// 			message: 'Email ja cadastrado'
// 		});
// 	}
// }

export const actions: Actions = {
	editarDadosPagamento: async ({ request, locals }) => {
		if (!locals) {
			return {
				status: 401,
				message: 'Nao autorizado'
			};
		}

		const dados = await request.formData();

		const pixType: any = dados.get('pixType') || '';

		const pixCode: any = dados.get('pixCode') || '';
		const promoCode: any = dados.get('promoCode') || '';

		console.log(pixType, pixCode, promoCode);

		try {
			await db
				.update(userTable)
				.set({ pixType, pixCode, promoCode })
				.where(eq(userTable.id, locals.user?.id || ''));
		} catch (e) {
			console.log(e);
			return fail(500, {
				status: 500,
				message: 'Erro ao atualizar os dados'
			});
		}

		return {
			status: 200,
			message: 'Dados de pagamento atualizados com sucesso'
		};
	}
};
