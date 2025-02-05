/* eslint-disable @typescript-eslint/no-explicit-any */
import { userTable } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';
import { cleanCPF, cleanCNPJ } from '$lib/uteis/masks';

export const actions: Actions = {
	editarDadosPix: async ({ request, locals }) => {
		if (!locals) {
			return {
				status: 400,
				message: 'Nao autorizado'
			};
		}

		const form = await request.formData();
		const pixType: any = form.get('pixType') || '';
		let pixCode: any = form.get('pixCode') || '';

		if (!pixType) {
			return fail(400, {
				status: 400,
				message: 'Selecione o tipo de chave pix'
			});
		}

		// Limpa a formatação do código PIX baseado no tipo
		if (pixType === 'cpf') {
			pixCode = cleanCPF(pixCode);
			if (pixCode.length !== 11) {
				return fail(400, {
					status: 400,
					message: 'CPF inválido'
				});
			}
		} else if (pixType === 'cnpj') {
			pixCode = cleanCNPJ(pixCode);
			if (pixCode.length !== 14) {
				return fail(400, {
					status: 400,
					message: 'CNPJ inválido'
				});
			}
		}
		try {
			await db
				.update(userTable)
				.set({ pixType, pixCode })
				.where(eq(userTable.id, locals.user?.id || ''));
		} catch (e) {
			console.error('Erro ao atualizar PIX:', e);
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
