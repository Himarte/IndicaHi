/* eslint-disable @typescript-eslint/no-explicit-any */
import { SITE_CHAVE_API } from '$env/static/private';
import { leadsTable, userTable } from '$lib/server/database/schema';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { eq } from 'drizzle-orm';

const validateApiKey = (request: Request): boolean => {
	return request.headers.get('API-KEY') === SITE_CHAVE_API;
};

const statusMap = {
	aguardando: 'Aguardando Pagamento',
	pagos: 'Pago'
} as const;

type StatusType = keyof typeof statusMap;

export const GET: RequestHandler = async ({ request, params }) => {
	try {
		if (!validateApiKey(request)) {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Chave de API inválida'
				}),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const status = statusMap[params.status as StatusType];

		if (!status) {
			return new Response(
				JSON.stringify({
					success: false,
					message: 'Status inválido'
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		const leadsComVendedores = await db
			.select({
				lead: {
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
					aguardandoPagamentoEm: leadsTable.aguardandoPagamentoEm,
					pagoEm: leadsTable.pagoEm,
				},
				vendedor: {
					id: userTable.id,
					nome: userTable.name,
					email: userTable.email,
					telefone: userTable.telefone,
					pixType: userTable.pixType,
					pixCode: userTable.pixCode
				}
			})
			.from(leadsTable)
			.leftJoin(userTable, eq(leadsTable.userIdPromoCode, userTable.id))
			.where(eq(leadsTable.status, status));

		const leadsFormatados = leadsComVendedores.map(({ lead, vendedor }) => ({
			...lead,
			vendedor: vendedor?.id
				? {
						...vendedor,
						pixInfo:
							vendedor?.pixType && vendedor?.pixCode
								? {
										tipo: vendedor?.pixType,
										chave: vendedor?.pixCode
									}
								: null
					}
				: null
		}));

		return new Response(
			JSON.stringify({
				success: true,
				data: leadsFormatados
			}),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Erro ao buscar leads:', error);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Erro interno do servidor',
				error: error instanceof Error ? error.message : 'Erro desconhecido'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
