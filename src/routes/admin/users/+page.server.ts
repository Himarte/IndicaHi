import type { PageServerLoad, Actions } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { userTable, type UserInsertSchema } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

interface DatabaseError {
	code: string;
	detail?: string;
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user?.job?.includes('Admin')) {
		return {
			usuarios: {
				vendedoresInternos: [],
				vendedoresExternos: [],
				administradores: [],
				financeiro: []
			}
		};
	}

	const fetchUsuariosPorCargo = async (cargo: string) => {
		try {
			const response = await fetch(`/api/admin/usuarios/${cargo}`, {
				method: 'GET',
				headers: {
					'API-KEY': SITE_CHAVE_API,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Erro ao buscar usuários ${cargo}`);
			}

			return await response.json();
		} catch (err) {
			console.error(`Erro ao buscar usuários ${cargo}:`, err);
			return [];
		}
	};

	const [vendedoresInternos, vendedoresExternos, administradores, financeiro] = await Promise.all([
		fetchUsuariosPorCargo('vendedores_internos'),
		fetchUsuariosPorCargo('vendedores_externos'),
		fetchUsuariosPorCargo('administrador'),
		fetchUsuariosPorCargo('financeiro')
	]);

	return {
		usuarios: {
			vendedoresInternos,
			vendedoresExternos,
			administradores,
			financeiro
		}
	};
};

export const actions: Actions = {
	updateUser: async ({ request, locals }) => {
		// Verificar se o usuário é admin
		if (!locals.user?.job?.includes('Admin')) {
			return fail(403, {
				success: false,
				message: 'Acesso negado. Apenas administradores podem editar usuários.'
			});
		}

		try {
			const formData = await request.formData();
			const userId = formData.get('userId') as string;

			if (!userId) {
				return fail(400, {
					success: false,
					message: 'ID do usuário é obrigatório'
				});
			}

			// Extrair e limpar dados do formulário
			const updateData: Partial<UserInsertSchema> = {};

			// Campos básicos
			const name = formData.get('name') as string;
			const email = formData.get('email') as string;
			const job = formData.get('job') as string;
			const status = formData.get('status') as string;

			if (name) updateData.name = name.trim();
			if (email) updateData.email = email.trim().toLowerCase();
			if (job) updateData.job = job as UserInsertSchema['job'];
			if (status) updateData.status = status === 'true';

			// Campos de contato
			const cpf = formData.get('cpf') as string;
			const telefone = formData.get('telefone') as string;
			const promoCode = formData.get('promoCode') as string;

			if (cpf) updateData.cpf = cpf.replace(/\D/g, ''); // Remove formatação
			if (telefone) updateData.telefone = telefone.replace(/\D/g, ''); // Remove formatação
			if (promoCode) updateData.promoCode = promoCode.trim().toUpperCase();

			// Campos PIX
			const pixType = formData.get('pixType') as string;
			const pixCode = formData.get('pixCode') as string;

			if (pixType) updateData.pixType = pixType as UserInsertSchema['pixType'];
			if (pixCode) updateData.pixCode = pixCode.trim();

			// Campos de endereço
			const cep = formData.get('cep') as string;
			const rua = formData.get('rua') as string;
			const numeroCasa = formData.get('numeroCasa') as string;
			const complemento = formData.get('complemento') as string;
			const bairro = formData.get('bairro') as string;
			const cidade = formData.get('cidade') as string;
			const estado = formData.get('estado') as string;

			if (cep) updateData.cep = cep.replace(/\D/g, '');
			if (rua) updateData.rua = rua.trim();
			if (numeroCasa) updateData.numeroCasa = parseInt(numeroCasa) || null;
			if (complemento) updateData.complemento = complemento.trim();
			if (bairro) updateData.bairro = bairro.trim();
			if (cidade) updateData.cidade = cidade.trim();
			if (estado) updateData.estado = estado.trim().toUpperCase();

			// Campos financeiros
			const bonusIndicacao = formData.get('bonusIndicacao') as string;
			const bonusIndicacaoResgatado = formData.get('bonusIndicacaoResgatado') as string;

			if (bonusIndicacao) updateData.bonusIndicacao = parseInt(bonusIndicacao) || 0;
			if (bonusIndicacaoResgatado)
				updateData.bonusIndicacaoResgatado = parseInt(bonusIndicacaoResgatado) || 0;

			// Atualizar usuário no banco de dados
			await db.update(userTable).set(updateData).where(eq(userTable.id, userId));

			return {
				success: true,
				message: 'Usuário atualizado com sucesso!'
			};
		} catch (error) {
			console.error('Erro ao atualizar usuário:', error);

			// Verificar se é erro de constraint (CPF, email ou promoCode duplicado)
			if (error && typeof error === 'object' && 'code' in error) {
				if ((error as DatabaseError).code === '23505') {
					// PostgreSQL unique constraint violation
					const detail = (error as DatabaseError).detail || '';
					if (detail.includes('cpf')) {
						return fail(400, {
							success: false,
							message: 'Este CPF já está cadastrado no sistema.'
						});
					}
					if (detail.includes('email')) {
						return fail(400, {
							success: false,
							message: 'Este e-mail já está cadastrado no sistema.'
						});
					}
					if (detail.includes('promo_code')) {
						return fail(400, {
							success: false,
							message: 'Este código promocional já está em uso.'
						});
					}
					if (detail.includes('pix_code')) {
						return fail(400, {
							success: false,
							message: 'Esta chave PIX já está cadastrada no sistema.'
						});
					}
				}
			}

			return fail(500, {
				success: false,
				message: 'Erro interno do servidor ao atualizar usuário.'
			});
		}
	}
};
