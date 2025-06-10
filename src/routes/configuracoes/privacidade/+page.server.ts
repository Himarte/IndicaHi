/* eslint-disable @typescript-eslint/no-explicit-any */
import { userTable } from '$lib/server/database/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';
import { cleanCPF, cleanCNPJ } from '$lib/uteis/masks';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	editarDadosPix: async ({ request, locals }) => {
		if (!locals?.user) {
			return fail(401, {
				status: 401,
				message: 'Não autorizado'
			});
		}

		const form = await request.formData();
		const pixType: any = form.get('pixType');
		const pixCodeRaw: any = form.get('pixCode');

		// Validar se o tipo foi selecionado
		if (!pixType || !['cpf', 'cnpj'].includes(pixType)) {
			return fail(400, {
				status: 400,
				message: 'Selecione um tipo de chave PIX válido'
			});
		}

		// Validar se o código foi informado
		if (!pixCodeRaw || !pixCodeRaw.trim()) {
			return fail(400, {
				status: 400,
				message: 'Informe a chave PIX'
			});
		}

		let pixCode: string;

		// Limpar e validar o código PIX baseado no tipo
		if (pixType === 'cpf') {
			pixCode = cleanCPF(pixCodeRaw);
			if (pixCode.length !== 11 || !/^\d{11}$/.test(pixCode)) {
				return fail(400, {
					status: 400,
					message: 'CPF inválido - deve conter 11 dígitos'
				});
			}
		} else if (pixType === 'cnpj') {
			pixCode = cleanCNPJ(pixCodeRaw);
			if (pixCode.length !== 14 || !/^\d{14}$/.test(pixCode)) {
				return fail(400, {
					status: 400,
					message: 'CNPJ inválido - deve conter 14 dígitos'
				});
			}
		} else {
			return fail(400, {
				status: 400,
				message: 'Tipo de chave PIX inválido'
			});
		}

		// Verificar se a chave PIX já está em uso por outro usuário
		if (pixCode !== locals.user.pixCode) {
			try {
				const existingPix = await db
					.select({ id: userTable.id })
					.from(userTable)
					.where(eq(userTable.pixCode, pixCode));

				if (existingPix.length > 0) {
					return fail(400, {
						status: 400,
						message: 'Esta chave PIX já está cadastrada por outro usuário'
					});
				}
			} catch (error) {
				console.error('Erro ao verificar chave PIX existente:', error);
				return fail(500, {
					status: 500,
					message: 'Erro interno ao validar chave PIX'
				});
			}
		}

		try {
			await db
				.update(userTable)
				.set({
					pixType: pixType as 'cpf' | 'cnpj',
					pixCode
				})
				.where(eq(userTable.id, locals.user.id));

			return {
				status: 200,
				message: 'Dados de pagamento atualizados com sucesso'
			};
		} catch (error) {
			console.error('Erro ao atualizar dados PIX:', error);
			return fail(500, {
				status: 500,
				message: 'Erro interno do servidor ao atualizar os dados'
			});
		}
	}
};
