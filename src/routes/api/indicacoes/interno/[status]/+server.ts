import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable, userTable } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

const statusMap = {
	pendentes: 'Pendente',
	atendimento: 'Sendo Atendido',
	finalizados: 'Finalizado',
	cancelados: 'Cancelado',
	pagos: 'Pago'
} as const;

type StatusMapKey = keyof typeof statusMap;
type StatusMapValue = (typeof statusMap)[StatusMapKey];

export const GET: RequestHandler = async ({ request, locals, params }) => {
	try {
		// Validações
		if (!validateApiKey(request)) {
			return new Response(JSON.stringify({ success: false, message: 'Chave de API inválida' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		if (!locals.user) {
			return new Response(JSON.stringify({ success: false, message: 'Usuário não autenticado' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const status = statusMap[params.status as StatusMapKey] as StatusMapValue;

		if (!status) {
			return new Response(JSON.stringify({ success: false, message: 'Status inválido' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Query otimizada com join para incluir dados do vendedor
		const results = await db
			.select({
				// Lead data
				id: leadsTable.id,
				fullName: leadsTable.fullName,
				cpf: leadsTable.cpf,
				cnpj: leadsTable.cnpj,
				status: leadsTable.status,
				promoCode: leadsTable.promoCode,
				telefone: leadsTable.telefone,
				planoNome: leadsTable.planoNome,
				planoModelo: leadsTable.planoModelo,
				planoMegas: leadsTable.planoMegas,
				criadoEm: leadsTable.criadoEm,
				atendidoEm: leadsTable.atendidoEm,
				atendidoPor: leadsTable.atendidoPor,
				finalizadoEm: leadsTable.finalizadoEm,
				pagoEm: leadsTable.pagoEm,
				pagoPor: leadsTable.pagoPor,
				canceladoEm: leadsTable.canceladoEm,
				aguardandoPagamentoEm: leadsTable.aguardandoPagamentoEm,

				// Vendedor data
				vendedorId: userTable.id,
				vendedorNome: userTable.name,
				vendedorEmail: userTable.email
			})
			.from(leadsTable)
			.leftJoin(userTable, eq(leadsTable.userIdPromoCode, userTable.id))
			.where(eq(leadsTable.status, status))
			.limit(100); // Limite para performance

		// Estruturar resposta
		const data = results.map((row) => ({
			// Lead info
			id: row.id,
			fullName: row.fullName,
			cpf: row.cpf,
			cnpj: row.cnpj,
			status: row.status,
			promoCode: row.promoCode,
			telefone: row.telefone,
			planoNome: row.planoNome,
			planoModelo: row.planoModelo,
			planoMegas: row.planoMegas,
			criadoEm: row.criadoEm,
			atendidoEm: row.atendidoEm,
			atendidoPor: row.atendidoPor,
			finalizadoEm: row.finalizadoEm,
			pagoEm: row.pagoEm,
			pagoPor: row.pagoPor,
			canceladoEm: row.canceladoEm,
			aguardandoPagamentoEm: row.aguardandoPagamentoEm,

			// Vendedor info (null se não existir)
			vendedor: row.vendedorId
				? {
						id: row.vendedorId,
						nome: row.vendedorNome,
						email: row.vendedorEmail
					}
				: null
		}));

		return new Response(JSON.stringify({ success: true, data, total: data.length }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'private, max-age=60' // Cache de 1 minuto
			}
		});
	} catch (error) {
		console.error('Erro ao buscar leads:', error);
		return new Response(JSON.stringify({ success: false, message: 'Erro interno do servidor' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
