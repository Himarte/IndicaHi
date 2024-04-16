import { createSessionCookie } from '$lib/server/authUtils.server';
import { getUserByEmail } from '$lib/server/database/utils/user.server';
import { lucia } from '$lib/server/lucia.server';
import { fail, type Actions } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		if (!email || !password) {
			return fail(400, {
				status: 400,
				message: 'Faltando email ou senha'
			});
		}
		const existingUser = await getUserByEmail(email.toString());

		if (!existingUser) {
			return fail(401, {
				status: 401,
				message: 'Email ou senha inválidos'
			});
		}

		const validPassword = await new Argon2id().verify(existingUser.password, password.toString());
		if (!validPassword) {
			return fail(401, {
				status: 401,
				message: 'Email ou senha inválidos'
			});
		}

		await createSessionCookie(lucia, existingUser.id, cookies);

		return {
			status: 200,
			message: 'Login efetuado com sucesso'
		};
	}
};
