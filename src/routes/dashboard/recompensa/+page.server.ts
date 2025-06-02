import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/database/db.server';
import { userTable, bonusResgateHistoricoTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return {
		userData: user
	};
};

export const actions: Actions = {
	resgatarRecompensa: async ({ request }) => {
		const formData = await request.formData();

		// Extrair dados do formulário
		const valorRecompensa = Number(formData.get('valorRecompensa'));
		const quantidadeIndicacoes = Number(formData.get('quantidadeIndicacoes'));
		const userId = formData.get('userId') as string;

		// Validar dados de entrada
		if (!userId || !valorRecompensa || !quantidadeIndicacoes) {
			return fail(400, {
				error: true,
				message: 'Dados de entrada inválidos.'
			});
		}

		if (valorRecompensa <= 0 || quantidadeIndicacoes < 0) {
			return fail(400, {
				error: true,
				message: 'Valores devem ser positivos.'
			});
		}

		try {
			// Buscar dados atuais do usuário
			const [userAtual] = await db
				.select()
				.from(userTable)
				.where(eq(userTable.id, userId))
				.limit(1);

			if (!userAtual) {
				return fail(404, {
					error: true,
					message: 'Usuário não encontrado.'
				});
			}

			const bonusAtualNoBanco = userAtual.bonusIndicacao || 0;

			// Verificar se os dados não estão desatualizados
			if (bonusAtualNoBanco !== quantidadeIndicacoes) {
				return fail(409, {
					error: true,
					message: 'Dados desatualizados. Recarregue a página e tente novamente.'
				});
			}

			// Definir milestones disponíveis
			const milestones = [
				{ id: 1, referrals: 0, reward: 0, completed: false },
				{ id: 2, referrals: 5, reward: 20, completed: false },
				{ id: 3, referrals: 10, reward: 45, completed: false },
				{ id: 4, referrals: 15, reward: 75, completed: false },
				{ id: 5, referrals: 20, reward: 150, completed: false }
			];

			// Encontrar milestones elegíveis para resgate
			const milestonesResgataveis = milestones.filter(
				(m) => bonusAtualNoBanco >= m.referrals && m.reward > 0
			);

			if (milestonesResgataveis.length === 0) {
				return fail(400, {
					error: true,
					message: 'Nenhum milestone atingido para resgate.'
				});
			}

			// Encontrar o maior milestone atingido
			const maiorMilestoneAtingido = milestonesResgataveis.sort(
				(a, b) => b.referrals - a.referrals
			)[0];

			// Validar se o valor solicitado está correto
			const valorTotalDisponivel = maiorMilestoneAtingido.reward;
			if (valorRecompensa !== valorTotalDisponivel) {
				return fail(400, {
					error: true,
					message: 'Valor de resgate incorreto. Tente novamente.'
				});
			}

			// Calcular novos saldos após resgate
			const indicacoesDoMilestone = maiorMilestoneAtingido.referrals;
			const novoSaldoIndicacoes = bonusAtualNoBanco - indicacoesDoMilestone;
			const jaResgatado = userAtual.bonusIndicacaoResgatado || 0;
			const novoTotalResgatado = jaResgatado + valorRecompensa;

			// Validar se o novo saldo não ficará negativo
			if (novoSaldoIndicacoes < 0) {
				return fail(400, {
					error: true,
					message: 'Erro no cálculo de indicações. Contate o suporte.'
				});
			}

			// Criar registro no histórico de resgate
			const resgateId = generateId(15);
			await db.insert(bonusResgateHistoricoTable).values({
				id: resgateId,
				userId: userId,
				valorResgatado: valorRecompensa
			});

			// Atualizar saldo do usuário
			await db
				.update(userTable)
				.set({
					bonusIndicacao: novoSaldoIndicacoes,
					bonusIndicacaoResgatado: novoTotalResgatado
				})
				.where(eq(userTable.id, userId));

			return {
				success: true,
				message: `Resgate de R$ ${valorRecompensa} processado com sucesso! Você gastou ${indicacoesDoMilestone} indicações. Saldo restante: ${novoSaldoIndicacoes} indicações.`
			};
		} catch (error) {
			console.error('Erro ao processar resgate:', error);
			return fail(500, {
				error: true,
				message: 'Erro interno do servidor. Tente novamente mais tarde.'
			});
		}
	}
};
