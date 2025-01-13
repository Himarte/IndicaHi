import { and, eq } from 'drizzle-orm';
import { userTable, leadsTable } from '$lib/server/database/schema';
import { db } from '$lib/server/database/db.server';

// Verificar se o Email ja esta cadastrado
export async function getUserByEmail(email: string) {
	return await db.select().from(userTable).where(eq(userTable.email, email));
}
// Verificar se o CPF ja esta cadastrado
export async function getUserByCpf(cpfLimpo: string) {
	return await db.select().from(userTable).where(eq(userTable.cpf, cpfLimpo));
}

// Verificar se o Email ja esta cadastrado
export const emailIsUsed = async (email: string) => {
	const queryResult = await db
		.select({
			email: userTable.email
		})
		.from(userTable)
		.where(eq(userTable.email, email));

	return queryResult.length > 0;
};
// Verificar se o CPF já está cadastrado
export const cpfIsUsed = async (cpf: string): Promise<boolean> => {
	const queryResult = await db
		.select({
			cpf: leadsTable.cpf
		})
		.from(leadsTable)
		.where(and(eq(leadsTable.status, 'Pendente'), eq(leadsTable.cpf, cpf)));

	console.log('queryResult:', queryResult);

	return queryResult.length > 0;
};

// Verificar se o CNPJ já está cadastrado
export const cnpjIsUsed = async (cnpj: string): Promise<boolean> => {
	const queryResult = await db
		.select({
			cnpj: leadsTable.cnpj
		})
		.from(leadsTable)
		.where(and(eq(leadsTable.status, 'Pendente'), eq(leadsTable.cnpj, cnpj)));

	return queryResult.length > 0;
};
// Pegar o ID do usuario pelo codigo promocional
export const getUserIdByPromoCode = async (promoCode: string) => {
	const result = await db
		.select({ id: userTable.id })
		.from(userTable)
		.where(eq(userTable.promoCode, promoCode));

	return result.length > 0 ? result[0].id : null;
};

// Verificar se o codigo promocional ja esta cadastrado
export const promoCodeIsUsed = async (promoCode: string) => {
	const queryResult = await db
		.select({
			promoCode: userTable.promoCode
		})
		.from(userTable)
		.where(eq(userTable.promoCode, promoCode));

	return queryResult.length > 0;
};

// Verifica se a Chave PIX ja esta cadastrada
export const pixCodeIsUsed = async (pixCode: string) => {
	const queryResult = await db
		.select({
			pixCode: userTable.pixCode
		})
		.from(userTable)
		.where(eq(userTable.pixCode, pixCode));

	return queryResult.length > 0;
};
