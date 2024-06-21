import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import { cleanCellPhone, cleanCPF } from '$lib/uteis/masks';

const validateData = (data: { [key: string]: string }) => {
	const { cpf, celular, pixType, pixCode, promoCode, userId } = data;

	if (!cpf || !celular || !pixType || !pixCode || !promoCode || !userId) {
		throw new Error('Todos os campos são obrigatórios.');
	}

	const cleanedCPF = cleanCPF(cpf);
	const cleanedCellPhone = cleanCellPhone(celular);

	if (cleanedCPF.length !== 11) throw new Error('CPF inválido.');
	if (cleanedCellPhone.length !== 11) throw new Error('Celular inválido.');
	if (!['cpf', 'cnpj', 'email', 'celular'].includes(pixType))
		throw new Error('Tipo de chave PIX inválido.');
	if (pixCode.length < 5) throw new Error('Chave PIX inválida.');

	return { cleanedCPF, cleanedCellPhone, pixType, pixCode, promoCode, userId };
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const data = {
			cpf: formData.get('cpf') as string,
			celular: formData.get('celular') as string,
			pixType: formData.get('pixType') as string,
			pixCode: formData.get('pixCode') as string,
			promoCode: formData.get('promoCode') as string,
			userId: formData.get('userId') as string
		};
		console.log('Dados recebidos:', formData);

		const { cleanedCPF, cleanedCellPhone, pixType, pixCode, promoCode, userId } =
			validateData(data);

		const result = await db
			.update(userTable)
			.set({
				cpf: cleanedCPF,
				telefone: cleanedCellPhone,
				pixCode,
				pixType,
				promoCode
			})
			.where(eq(userTable.id, userId));

		if (result) {
			return new Response(JSON.stringify({ message: 'Dados atualizados com sucesso.' }), {
				status: 200
			});
		} else {
			return new Response(JSON.stringify({ message: 'Falha ao atualizar os dados.' }), {
				status: 500
			});
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error('Erro ao atualizar os dados:', error);
		return new Response(
			JSON.stringify({ message: error.message || 'Erro ao atualizar os dados.' }),
			{
				status: error.message ? 400 : 500
			}
		);
	}
};
