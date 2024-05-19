/* eslint-disable @typescript-eslint/no-explicit-any */
import { userTable } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';
import { emailIsUsed } from '$lib/server/database/utils/user.server';
import { emailRegex } from '$lib/server/authUtils.server';

export const load: PageServerLoad = async ({ fetch }) => {
	const dadosPerfilUser = fetch('/api/perfil', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());

	return {
		dadosPerfilUser
	};
};

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
		const pixCode: any = form.get('pixCode') || '';

		if (pixType === 'undefined') {
			return fail(400, {
				status: 400,
				message: 'Selecione o tipo de chave pix'
			});
		}
		// Verifica se o pixCode é válido e não está vazio
		if (!pixCode || pixCode.length < 10) {
			return fail(400, {
				status: 400,
				message: 'Código pix inválido'
			});
		}

		try {
			await db
				.update(userTable)
				.set({ pixType, pixCode })
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
	},
	trocaEmail: async ({ request, locals }) => {
		if (!locals) {
			return {
				status: 401,
				message: 'Nao autorizado'
			};
		}
		const form = await request.formData();
		const oldEmail: any = form.get('oldEmail') || '';
		let newEmail: any = form.get('newEmail') || '';

		if (!newEmail) {
			return fail(400, {
				status: 400,
				message: 'Email vazio'
			});
		}
		if (newEmail === oldEmail) {
			return fail(400, {
				status: 400,
				message: 'Emails iguais'
			});
		}

		// Coloca o newEmail em lowercase
		newEmail = newEmail.toLowerCase();

		// Verifica se o email é válido
		if (!emailRegex.test(newEmail)) {
			return fail(400, {
				status: 400,
				message: 'Email inválido'
			});
		}

		// Verifica se o email já está cadastrado
		const emailUsed = await emailIsUsed(newEmail);
		if (emailUsed) {
			return fail(400, {
				status: 400,
				message: 'Email já cadastrado'
			});
		}

		try {
			await db
				.update(userTable)
				.set({ email: newEmail })
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
			message: 'Email atualizado com sucesso'
		};
	}
};
