/* eslint-disable @typescript-eslint/no-explicit-any */
import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable, userTable } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

const statusMap = {
	aguardando: 'Aguardando Pagamento',
	pagos: 'Pago'
} as const;

export const GET: RequestHandler = async ({ request, params }) => {
	try {
		// Validação API Key
		if (request.headers.get('API-KEY') !== SITE_CHAVE_API) {
			return new Response(JSON.stringify({ success: false, message: 'Chave de API inválida' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Validação Status
		const status = statusMap[params.status as keyof typeof statusMap];
		if (!status) {
			return new Response(JSON.stringify({ success: false, message: 'Status inválido' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Query otimizada - busca apenas campos necessários
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
				pagoEm: leadsTable.pagoEm,
				pagoPor: leadsTable.pagoPor,

				// Vendedor data
				vendedorId: userTable.id,
				vendedorNome: userTable.name,
				vendedorEmail: userTable.email,
				vendedorTelefone: userTable.telefone,
				vendedorPixType: userTable.pixType,
				vendedorPixCode: userTable.pixCode,
				vendedorBonusResgatado: userTable.bonusIndicacaoResgatado
			})
			.from(leadsTable)
			.leftJoin(userTable, eq(leadsTable.userIdPromoCode, userTable.id))
			.where(eq(leadsTable.status, status));

		// Mapeamento simplificado
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
			pagoEm: row.pagoEm,
			pagoPor: row.pagoPor,

			// Vendedor info (null se não existir)
			vendedor: row.vendedorId
				? {
						id: row.vendedorId,
						nome: row.vendedorNome,
						email: row.vendedorEmail,
						telefone: row.vendedorTelefone,
						pixType: row.vendedorPixType,
						pixCode: row.vendedorPixCode,
						bonusIndicacaoResgatado: row.vendedorBonusResgatado
					}
				: null
		}));

		return new Response(JSON.stringify({ success: true, data }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Erro ao buscar leads:', error);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Erro interno do servidor'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
