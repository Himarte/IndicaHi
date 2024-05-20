import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema.js';
import { eq } from 'drizzle-orm';

export async function GET({ locals }) {
	// TODO: validar se o usuario tem local

	if (!locals.user) {
		return new Response('Nao autorizado', {
			status: 401
		});
	}

	// Pego os dados do usuario logado
	const dadosUser = await db
		.select()
		.from(userTable)
		.where(eq(userTable.id, locals.user?.id || ''));

	// Peguei os dados do usuario, baseado no id do usuario logado, e converto para JSON
	// Se não encontrar o usuario, retorna null
	const user = JSON.stringify(dadosUser[0] || null);

	return new Response(user, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
