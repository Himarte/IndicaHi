import type { Actions, PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { leadsTable, motivoCancelado, userTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchLeadsByStatus = async (status: string) => {
		try {
			const response = await fetch(`/api/indicacoes/interno/${status}`, {
				method: 'GET',
				headers: {
					'API-KEY': SITE_CHAVE_API,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Erro ao buscar leads ${status}`);
			}

			const result = await response.json();

			// Retorna apenas os dados se a resposta foi bem-sucedida
			return result.success ? result.data : [];
		} catch (err) {
			console.error(`Erro ao buscar leads ${status}:`, err);
			return [];
		}
	};

	const [pendentes, emAtendimento, finalizados, pagos, cancelados] = await Promise.all([
		fetchLeadsByStatus('pendentes'),
		fetchLeadsByStatus('atendimento'),
		fetchLeadsByStatus('finalizados'),
		fetchLeadsByStatus('pagos'),
		fetchLeadsByStatus('cancelados')
	]);

	return {
		leads: {
			pendentes,
			emAtendimento,
			finalizados: [...finalizados, ...pagos],
			cancelados
		}
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		// Validação de autenticação
		if (!locals.user) {
			return fail(401, {
				success: false,
				message: 'Usuário não autenticado'
			});
		}

		// Verificar se o usuário tem permissão (interno ou admin)
		const allowedJobs = ['Vendedor Interno', 'Admin'];
		if (!allowedJobs.includes(locals.user.job || '')) {
			return fail(403, {
				success: false,
				message:
					'Acesso negado. Apenas vendedores internos ou administradores podem atualizar status.'
			});
		}

		try {
			// Obtém os dados do formulário
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const status = formData.get('status') as string;
			const motivo = formData.get('motivo') as string;

			// Validação de campos obrigatórios
			if (!id || !status) {
				return fail(400, {
					success: false,
					message: 'ID e status são obrigatórios.'
				});
			}

			// Validação de formato do ID
			if (typeof id !== 'string' || id.trim().length === 0) {
				return fail(400, {
					success: false,
					message: 'ID inválido.'
				});
			}

			// Busca o lead no banco de dados
			const lead = await db.select().from(leadsTable).where(eq(leadsTable.id, id));

			if (!lead || lead.length === 0) {
				return fail(404, {
					success: false,
					message: 'Lead não encontrado ou não autorizado'
				});
			}

			// Atualiza o status do lead
			const validStatuses = [
				'Cancelado',
				'Pendente',
				'Sendo Atendido',
				'Finalizado',
				'Pago',
				'Aguardando Pagamento'
			] as const;

			if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
				return fail(400, {
					success: false,
					message: 'Status inválido.'
				});
			}

			// Preparar os dados para atualização com os timestamps apropriados
			const updateData: {
				status: (typeof validStatuses)[number];
				atendidoPor: string;
				atendidoEm?: string;
				finalizadoEm?: string;
				pagoEm?: string;
				aguardandoPagamentoEm?: string;
				canceladoEm?: string | null;
			} = {
				status: status as (typeof validStatuses)[number],
				atendidoPor: locals.user.name
			};

			// Atualizar o timestamp correspondente ao status atual
			const now = new Date().toISOString();
			if (status === 'Sendo Atendido') {
				updateData.atendidoEm = now;
			} else if (status === 'Finalizado') {
				updateData.finalizadoEm = now;
			} else if (status === 'Pago') {
				updateData.pagoEm = now;
			} else if (status === 'Aguardando Pagamento') {
				updateData.aguardandoPagamentoEm = now;

				// Incrementar o bônus de indicação do usuário indicador
				if (lead[0].userIdPromoCode) {
					// Buscar o usuário indicador pelo ID
					const usuarioIndicador = await db
						.select()
						.from(userTable)
						.where(eq(userTable.id, lead[0].userIdPromoCode));

					if (usuarioIndicador && usuarioIndicador.length > 0) {
						// Incrementar o bônus de indicação
						await db
							.update(userTable)
							.set({
								bonusIndicacao: (usuarioIndicador[0].bonusIndicacao || 0) + 1
							})
							.where(eq(userTable.id, lead[0].userIdPromoCode));
					}
				}
			} else if (status === 'Cancelado') {
				updateData.canceladoEm = now;
			}

			// Atualiza o status do lead
			await db.update(leadsTable).set(updateData).where(eq(leadsTable.id, id));

			// Se o status for "Cancelado", salva o motivo na tabela `motivo_cancelado`
			if (status === 'Cancelado' && motivo) {
				// Verificar se já existe um motivo para este lead
				const motivoExistente = await db
					.select()
					.from(motivoCancelado)
					.where(eq(motivoCancelado.leadId, id));

				if (motivoExistente.length > 0) {
					// Se já existe um motivo, atualiza
					await db.update(motivoCancelado).set({ motivo }).where(eq(motivoCancelado.leadId, id));
				} else {
					// Se não existe, insere um novo
					await db.insert(motivoCancelado).values({
						id: crypto.randomUUID(), // Gera um UUID para o registro
						motivo,
						leadId: id // Relaciona o motivo com o lead
					});
				}
			}

			return {
				success: true,
				message: `Status atualizado para ${status} com sucesso.`,
				newStatus: status
			};
		} catch (error) {
			console.error('Erro ao atualizar status:', error);
			return fail(500, {
				success: false,
				message: 'Erro ao atualizar status.'
			});
		}
	}
};
