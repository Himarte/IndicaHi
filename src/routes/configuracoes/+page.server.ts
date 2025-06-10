/* eslint-disable @typescript-eslint/no-explicit-any */
import { cpfIsUsed } from '$lib/server/database/utils/user.server';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { cleanCPF } from '$lib/uteis/masks';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};

export const actions: Actions = {
	editarDadosPessoais: async ({ request, locals }) => {
		if (!locals?.user) {
			return fail(401, {
				status: 401,
				message: 'Não autorizado'
			});
		}

		const dados = await request.formData();
		const cpfRaw: any = dados.get('cpf');
		const promoCode: any = dados.get('promoCode');

		// Processar CPF
		let cpf = locals.user.cpf; // Manter o CPF atual se não for alterado
		if (cpfRaw && cpfRaw.trim() !== '') {
			cpf = cleanCPF(cpfRaw);

			// Validar CPF
			if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
				return fail(400, {
					status: 400,
					message: 'CPF inválido'
				});
			}

			// Verificar se o CPF já está em uso (apenas se for diferente do atual)
			if (cpf !== locals.user.cpf) {
				const cpfUsed = await cpfIsUsed(cpf);
				if (cpfUsed) {
					return fail(400, {
						status: 400,
						message: 'CPF já cadastrado'
					});
				}
			}
		}

		// Processar código promocional
		let finalPromoCode = locals.user.promoCode; // Manter o atual se não for alterado
		if (promoCode !== undefined && promoCode !== null) {
			const trimmedPromoCode = promoCode.trim();

			if (trimmedPromoCode.length > 15) {
				return fail(400, {
					status: 400,
					message: 'Código promocional inválido: máximo de 15 caracteres'
				});
			}

			// Verificar se o código promocional já está em uso (apenas se for diferente do atual)
			if (trimmedPromoCode !== locals.user.promoCode && trimmedPromoCode !== '') {
				const promoCodeUsed = await db
					.select({
						promoCode: userTable.promoCode
					})
					.from(userTable)
					.where(eq(userTable.promoCode, trimmedPromoCode));

				if (promoCodeUsed.length > 0) {
					return fail(400, {
						status: 400,
						message: 'Código promocional já cadastrado'
					});
				}
			}

			finalPromoCode = trimmedPromoCode || null;
		}

		try {
			await db
				.update(userTable)
				.set({
					cpf: cpf || null,
					promoCode: finalPromoCode
				})
				.where(eq(userTable.id, locals.user.id));

			return {
				status: 200,
				message: 'Dados atualizados com sucesso'
			};
		} catch (error) {
			console.error('Erro ao atualizar dados pessoais:', error);
			return fail(500, {
				status: 500,
				message: 'Erro interno do servidor ao atualizar os dados'
			});
		}
	},

	editarLocalizacao: async ({ request, locals }) => {
		if (!locals?.user) {
			return fail(401, {
				status: 401,
				message: 'Não autorizado'
			});
		}

		const dados = await request.formData();

		// Extrair e validar dados
		const cepRaw: any = dados.get('cep');
		const rua: any = dados.get('rua');
		const bairro: any = dados.get('bairro');
		const numeroCasaRaw: any = dados.get('numeroCasa');
		const complemento: any = dados.get('complemento');
		const cidade: any = dados.get('cidade');
		const estadoRaw: any = dados.get('estado');

		// Processar CEP
		let cep: string | null = locals.user.cep;
		if (cepRaw && cepRaw.trim() !== '') {
			const cepProcessado = cepRaw.replace(/\D/g, '');
			if (cepProcessado.length !== 8) {
				return fail(400, {
					status: 400,
					message: 'CEP deve conter exatamente 8 dígitos'
				});
			}
			cep = cepProcessado;
		}

		// Processar número da casa
		let numeroCasa = locals.user.numeroCasa;
		if (numeroCasaRaw && numeroCasaRaw.trim() !== '') {
			numeroCasa = parseInt(numeroCasaRaw);
			if (isNaN(numeroCasa) || numeroCasa <= 0) {
				return fail(400, {
					status: 400,
					message: 'Número da casa deve ser um número válido'
				});
			}
		}

		// Processar estado
		let estado: string | null = locals.user.estado;
		if (estadoRaw && estadoRaw.trim() !== '') {
			const estadoProcessado = estadoRaw.toUpperCase().trim();
			if (estadoProcessado.length !== 2 || !/^[A-Z]{2}$/.test(estadoProcessado)) {
				return fail(400, {
					status: 400,
					message: 'Estado deve conter exatamente 2 letras'
				});
			}
			estado = estadoProcessado;
		}

		// Processar outros campos (permitindo strings vazias)
		const finalRua = rua?.trim() || null;
		const finalBairro = bairro?.trim() || null;
		const finalComplemento = complemento?.trim() || null;
		const finalCidade = cidade?.trim() || null;

		try {
			await db
				.update(userTable)
				.set({
					cep: cep || null,
					rua: finalRua,
					numeroCasa: numeroCasa || null,
					complemento: finalComplemento,
					cidade: finalCidade,
					estado: estado || null,
					bairro: finalBairro
				})
				.where(eq(userTable.id, locals.user.id));

			return {
				status: 200,
				message: 'Localização atualizada com sucesso'
			};
		} catch (error) {
			console.error('Erro ao atualizar localização:', error);
			return fail(500, {
				status: 500,
				message: 'Erro interno do servidor ao atualizar localização'
			});
		}
	}
};
