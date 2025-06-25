import type { PageServerLoad, Actions } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { leadsTable, type LeadsSchema } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

interface DatabaseError {
	code: string;
	detail?: string;
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
	// Verificar se o usuário é admin
	if (!locals.user?.job?.includes('Admin')) {
		return {
			leads: Promise.resolve({
				pendentes: [],
				emAtendimento: [],
				aguardandoPagamento: [],
				pagos: [],
				finalizados: [],
				cancelados: []
			})
		};
	}

	const fetchLeadsByStatus = async (status: string) => {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000);

			const response = await fetch(`/api/admin/leads/${status}`, {
				method: 'GET',
				headers: {
					'API-KEY': SITE_CHAVE_API,
					'Content-Type': 'application/json'
				},
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`Erro ao buscar leads ${status}`);
			}

			const data = await response.json();
			return data;
		} catch (err) {
			console.error(`Erro ao buscar leads ${status}:`, err);
			return [];
		}
	};

	return {
		leads: Promise.all([
			fetchLeadsByStatus('pendentes'),
			fetchLeadsByStatus('em-atendimento'),
			fetchLeadsByStatus('aguardando-pagamento'),
			fetchLeadsByStatus('pagos'),
			fetchLeadsByStatus('finalizados'),
			fetchLeadsByStatus('cancelados')
		]).then(([pendentes, emAtendimento, aguardandoPagamento, pagos, finalizados, cancelados]) => ({
			pendentes,
			emAtendimento,
			aguardandoPagamento,
			pagos,
			finalizados,
			cancelados
		}))
	};
};

export const actions: Actions = {
	updateLead: async ({ request, locals }) => {
		// Verificar se o usuário é admin
		if (!locals.user?.job?.includes('Admin')) {
			return fail(403, {
				success: false,
				message: 'Acesso negado. Apenas administradores podem editar leads.'
			});
		}

		try {
			const formData = await request.formData();
			const leadId = formData.get('leadId') as string;

			if (!leadId) {
				return fail(400, {
					success: false,
					message: 'ID do lead é obrigatório'
				});
			}

			// Extrair e limpar dados do formulário
			const updateData: Partial<LeadsSchema> = {};

			// Campos básicos
			const fullName = formData.get('fullName') as string;
			const status = formData.get('status') as string;
			const promoCode = formData.get('promoCode') as string;

			if (fullName) updateData.fullName = fullName.trim();
			if (status) updateData.status = status as LeadsSchema['status'];
			if (promoCode) updateData.promoCode = promoCode.trim().toLowerCase();

			// Campos de contato
			const telefone = formData.get('telefone') as string;
			const cpf = formData.get('cpf') as string;
			const cnpj = formData.get('cnpj') as string;

			if (telefone) updateData.telefone = telefone.replace(/\D/g, ''); // Remove formatação
			if (cpf) updateData.cpf = cpf.replace(/\D/g, ''); // Remove formatação
			if (cnpj) updateData.cnpj = cnpj.replace(/\D/g, ''); // Remove formatação

			// Campos do plano
			const planoNome = formData.get('planoNome') as string;
			const planoMegas = formData.get('planoMegas') as string;
			const planoModelo = formData.get('planoModelo') as string;

			if (planoNome) updateData.planoNome = planoNome.trim();
			if (planoMegas) updateData.planoMegas = parseInt(planoMegas) || null;
			if (planoModelo) updateData.planoModelo = planoModelo as LeadsSchema['planoModelo'];

			// Campos de atendimento
			const atendidoPor = formData.get('atendidoPor') as string;
			const pagoPor = formData.get('pagoPor') as string;

			if (atendidoPor) updateData.atendidoPor = atendidoPor.trim();
			if (pagoPor) updateData.pagoPor = pagoPor.trim();

			// Atualizar lead no banco de dados
			await db.update(leadsTable).set(updateData).where(eq(leadsTable.id, leadId));

			return {
				success: true,
				message: 'Lead atualizado com sucesso!'
			};
		} catch (error) {
			console.error('Erro ao atualizar lead:', error);

			// Verificar se é erro de constraint
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
					if (detail.includes('cnpj')) {
						return fail(400, {
							success: false,
							message: 'Este CNPJ já está cadastrado no sistema.'
						});
					}
				}
			}

			return fail(500, {
				success: false,
				message: 'Erro interno do servidor ao atualizar lead.'
			});
		}
	}
};
