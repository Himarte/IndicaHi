import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { eq, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		// Validação de autenticação
		if (!locals.user) {
			return json({ success: false, message: 'Usuário não autenticado' }, { status: 401 });
		}

		const userPromoCode = locals.user.promoCode;
		if (!userPromoCode) {
			return json(
				{ success: false, message: 'Usuário sem código promocional válido' },
				{ status: 403 }
			);
		}

		// Query otimizada que busca dados agregados em uma única consulta
		const estatisticas = await db
			.select({
				status: leadsTable.status,
				quantidade: sql<number>`count(*)`,
				valorTotal: sql<number>`count(*) * 50`, // Assumindo R$ 50 por lead
				ultimaAtualizacao: sql<string>`max(${leadsTable.criadoEm})`
			})
			.from(leadsTable)
			.where(eq(leadsTable.promoCode, userPromoCode))
			.groupBy(leadsTable.status);

		// Estruturar dados de resposta
		const resumo = {
			pendentes: 0,
			emAtendimento: 0,
			aguardandoPagamento: 0,
			pagos: 0,
			cancelados: 0,
			total: 0,
			valorTotal: 0,
			ultimaAtualizacao: null as string | null
		};

		let maiorData = '';

		estatisticas.forEach((item) => {
			const quantidade = Number(item.quantidade);
			const valor = Number(item.valorTotal);

			resumo.total += quantidade;
			resumo.valorTotal += valor;

			if (item.ultimaAtualizacao && item.ultimaAtualizacao > maiorData) {
				maiorData = item.ultimaAtualizacao;
				resumo.ultimaAtualizacao = item.ultimaAtualizacao;
			}

			switch (item.status) {
				case 'Pendente':
					resumo.pendentes = quantidade;
					break;
				case 'Sendo Atendido':
					resumo.emAtendimento = quantidade;
					break;
				case 'Aguardando Pagamento':
					resumo.aguardandoPagamento = quantidade;
					break;
				case 'Pago':
					resumo.pagos = quantidade;
					break;
				case 'Cancelado':
					resumo.cancelados = quantidade;
					break;
			}
		});

		return json(
			{
				success: true,
				data: {
					resumo,
					detalhado: estatisticas,
					usuario: {
						promoCode: userPromoCode,
						nome: locals.user.name
					}
				}
			},
			{
				headers: {
					'Cache-Control': 'private, max-age=300' // Cache de 5 minutos
				}
			}
		);
	} catch (error) {
		console.error('Erro ao buscar estatísticas do dashboard:', error);
		return json({ success: false, message: 'Erro interno do servidor' }, { status: 500 });
	}
};
