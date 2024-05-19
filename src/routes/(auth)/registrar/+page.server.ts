/* eslint-disable @typescript-eslint/no-explicit-any */
import { lucia } from '$lib/server/lucia.server';
import { fail } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import type { Actions } from './$types';
import { createSessionCookie } from '$lib/server/authUtils.server';
import { getUserByCpf, getUserByEmail } from '$lib/server/database/utils/user.server';
import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
export const actions: Actions = {
	registrar: async (event) => {
		const formData = await event.request.formData();

		const email: any = formData.get('email');
		let name: any = formData.get('name');
		let lastName: any = formData.get('lastName');
		const password: any = formData.get('password');
		let cpf: any = formData.get('cpf');
		let telefone: any = formData.get('telefone');

		console.log('email', email);
		console.log('name', name);
		console.log('lastName', lastName);
		console.log('password', password);
		console.log('cpf', cpf);
		console.log('telefone', telefone);

		// Validacao se o email ja esta cadastrado
		const dbUser = await getUserByEmail(email.toString());

		if (dbUser) {
			return fail(400, {
				status: 400,
				message: 'Email já cadastrado'
			});
		}

		// Validacao de Nome e Sobrenome
		// Valida Name, minimo de 3 caracteres e maximo de 254, NAO permite espacos
		name = name.toLowerCase();
		if (
			typeof name !== 'string' ||
			name.length < 3 ||
			name.length > 31 ||
			!/^[a-z0-9_-]+$/.test(name)
		) {
			return fail(400, {
				status: 400,
				message: 'Nome inválido'
			});
		}

		// Valida LastName, minimo de 3 caracteres e maximo de 254, permite espacos, underline e hifen
		lastName = lastName.toLowerCase();

		if (
			typeof lastName !== 'string' ||
			lastName.length < 3 ||
			lastName.length > 254 ||
			!/^[a-z\s_-]+$/.test(lastName)
		) {
			return fail(400, {
				status: 400,
				message: 'Sobrenome inválido'
			});
		}

		// Validacao do CPF
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

		// Limpar Celular
		function limparCelular(telefone: string): string {
			return telefone.replace(/\(|\)|\s|-/g, '');
		}
		telefone = limparCelular(telefone);
		if (telefone.length !== 11) {
			return fail(400, {
				status: 400,
				message: 'Telefone inválido'
			});
		}

		// Validacao se o CPF ja esta cadastrado
		const dbUserCpf = await getUserByCpf(cpf);
		if (dbUserCpf) {
			return fail(400, {
				status: 400,
				message: 'CPF já cadastrado'
			});
		}
		// Validacao da senha
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				status: 400,
				message: 'Senha invalida, deve ter pelo menos 6 digitos'
			});
		}
		// Gerar ID para o usuario
		const idUser = generateId(8);
		// Hash da senha do usuario
		const hashedPassword = await new Argon2id().hash(password.toString());

		// Inserindo usuario no banco de dados
		const nUser = await db
			.insert(userTable)
			.values({
				id: idUser,
				name: name,
				lastName: lastName,
				email: email,
				password: hashedPassword,
				cpf: cpf,
				telefone: telefone,
				promoCode: generateId(8)
			})
			.returning({ id: userTable.id });

		if (!nUser) {
			return fail(500, {
				status: 500,
				message: 'Erro no servidor, entre em contato com o suporte técnico.'
			});
		}

		// Funcao para criar um cookie de sessao (server/authUtils.server.ts)
		await createSessionCookie(lucia, nUser[0].id, event.cookies);
		// TODO: Redirecionar para a pagina de perfil apos fazer perfil
		return {
			status: 200,
			message: 'Usuario cadastrado com sucesso'
		};
	}
};
