import { auth } from '$lib/server/lucia.server';
import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
import { SITE_CHAVE_API } from '$env/static/private';
import type { RequestHandler } from './$types';
import { generateId } from 'lucia';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

const adminSchema = z.object({
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email inválido'),
	telefone: z.string().min(10, 'Telefone inválido'),
	cpf: z
		.string()
		.min(11, 'CPF inválido')
		.max(14, 'CPF inválido')
		.refine((cpf) => {
			const cleanCpf = cpf.replace(/\D/g, '');
			return cleanCpf.length === 11;
		}, 'CPF deve conter 11 dígitos'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!validateApiKey(request)) {
			return new Response(JSON.stringify({ error: 'Não autorizado' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const formData = await request.formData();
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			telefone: formData.get('telefone'),
			cpf: formData.get('cpf'),
			password: formData.get('password')
		};

		const validatedData = adminSchema.parse(data);

		// Verifica se já existe um usuário com este email
		const existingUser = await db.query.userTable.findFirst({
			where: (user) => eq(user.email, validatedData.email)
		});

		if (existingUser) {
			return new Response(JSON.stringify({ error: 'Email já cadastrado' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Cria o usuário no Lucia Auth
		const userId = generateId(15);
		await auth.createUser({
			userId,
			key: {
				providerId: 'email',
				providerUserId: validatedData.email,
				password: validatedData.password
			},
			attributes: {
				name: validatedData.name,
				email: validatedData.email,
				telefone: validatedData.telefone,
				cpf: validatedData.cpf,
				job: 'Admin',
				avatarUrl: null,
				promoCode: null
			}
		});

		return new Response(JSON.stringify({ message: 'Administrador criado com sucesso' }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Erro ao criar administrador:', error);

		if (error instanceof z.ZodError) {
			return new Response(
				JSON.stringify({
					error: error.errors[0].message,
					details: error.errors
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		return new Response(
			JSON.stringify({
				error: 'Erro interno ao criar administrador',
				details: error instanceof Error ? error.message : 'Erro desconhecido'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
