import { db } from '$lib/server/database/db.server';

import { userTable } from '$lib/server/database/schema.js';

import { eq } from 'drizzle-orm';

export async function GET({ locals }) {
	// Isso retorna um array de resultados que correspondem à condição.
	const result = await db.select().from(userTable).where(eq(userTable.id, locals.user?.id));

	// Tenta obter o primeiro elemento do array de resultados. Se o array estiver vazio, atribui 'null' a 'user'.
	const user = result[0] || null;

	// Converte o objeto 'user' (ou 'null') em uma string JSON.
	// Isso é necessário porque a resposta HTTP deve ser uma string ou um buffer.
	const jsonResult = JSON.stringify(user);

	// Retorna uma nova resposta HTTP com o 'jsonResult' como corpo.
	// Por padrão, o SvelteKit trata isso como 'text/html'. Você poderia especificar o cabeçalho 'Content-Type' como 'application/json'
	// para deixar explícito que o corpo da resposta é um JSON, facilitando a interpretação correta pelo cliente.
	return new Response(jsonResult, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
