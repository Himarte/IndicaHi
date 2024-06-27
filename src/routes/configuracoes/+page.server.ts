/* eslint-disable @typescript-eslint/no-explicit-any */
import { cpfIsUsed } from '$lib/server/database/utils/user.server';
import type { Actions } from './$types';
import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	editarDadosPessoais: async ({ request, locals }) => {
		if (!locals) {
			return {
				status: 401,
				message: 'Nao autorizado'
			};
		}

		const dados = await request.formData();
		let cpf: any = dados.get('cpf') || locals.user?.cpf;
		const promoCode: any = dados.get('promoCode') || locals.user?.promoCode;

		console.log(`Dados da edição de dados pessoais: ${cpf}, ${promoCode}`);

		function limparCPF(cpf: string): string {
			return cpf.replace(/\.|-|\s/g, '');
		}
		cpf = limparCPF(cpf);

		if (cpf.length !== 11) {
			return fail(400, {
				status: 400,
				message: 'CPF inválido'
			});
		}

		if (cpf !== locals.user?.cpf) {
			const cpfUsed = await cpfIsUsed(cpf);
			if (cpfUsed) {
				return fail(400, {
					status: 400,
					message: 'CPF já cadastrado'
				});
			}
		}
		if (promoCode.length > 15) {
			return fail(400, {
				status: 400,
				message: 'Código promocional inválido: máximo de 15 caracteres'
			});
		}

		if (promoCode !== locals.user?.promoCode) {
			const promoCodeUsed = await db
				.select({
					promoCode: userTable.promoCode
				})
				.from(userTable)
				.where(eq(userTable.promoCode, promoCode));

			if (promoCodeUsed.length > 0) {
				return fail(400, {
					status: 400,
					message: 'Código promocional já cadastrado'
				});
			}
		}

		await db
			.update(userTable)
			.set({ cpf, promoCode })
			.where(eq(userTable.id, locals.user?.id || ''));

		return {
			status: 200,
			message: 'Dados atualizados com sucesso'
		};
	},

	editarLocalizacao: async ({ request, locals }) => {
		if (!locals) {
			return {
				status: 401,
				message: 'Nao autorizado'
			};
		}

		const dados = await request.formData();

		const cep: any = dados.get('cep') || '';
		const rua: any = dados.get('rua') || '';
		const bairro: any = dados.get('bairro') || '';
		const numeroCasa: any = dados.get('numeroCasa') || '';
		const complemento: any = dados.get('complemento') || '';
		const cidade: any = dados.get('cidade') || '';
		const estado: any = dados.get('estado') || '';

		try {
			await db
				.update(userTable)
				.set({ cep, rua, numeroCasa, complemento, cidade, estado, bairro })
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
			message: 'Localização atualizada com sucesso'
		};
	}
};
