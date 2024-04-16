/* eslint-disable @typescript-eslint/no-explicit-any */
import { emailIsUsed, cpfIsUsed } from '$lib/server/database/utils/user.server';
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

		const name: any = dados.get('name') || locals.user?.name;
		const lastName: any = dados.get('lastName') || locals.user?.lastName;
		let cpf: any = dados.get('cpf') || locals.user?.cpf;
		const email: any = dados.get('email') || locals.user?.email;

		// Verificar se o email ja esta cadastrado
		if (email !== locals.user?.email) {
			const emailUsed = await emailIsUsed(email);
			if (emailUsed) {
				return fail(400, {
					status: 400,
					message: 'Email ja cadastrado'
				});
			}
		}

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
		console.log('chegou aqui');

		try {
			await db
				.update(userTable)
				.set({ name, lastName, cpf, email })
				.where(eq(userTable.id, locals.user?.id || ''));
		} catch (e) {
			console.log(e);
			return fail(500, {
				status: 500,
				message: 'Erro ao atualizar os dados'
			});
		}
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
	},

	// TODO: promoCode nao ta pegando la do form
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
