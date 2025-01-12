import type { Actions, PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchLeadsByStatus = async (status: string) => {
		try {
			const response = await fetch(`/api/indicacoes/financeiro/${status}`, {
				method: 'GET',
				headers: {
					'API-KEY': SITE_CHAVE_API,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Erro ao buscar leads ${status}`);
			}

			return await response.json();
		} catch (err) {
			console.error(`Erro ao buscar leads ${status}:`, err);
			return [];
		}
	};

	const [aguardandoPagamento, pagos] = await Promise.all([
		fetchLeadsByStatus('aguardando'),
		fetchLeadsByStatus('pagos')
	]);

	return {
		leads: {
			aguardandoPagamento,
			pagos
		}
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				success: false,
				message: 'Não autorizado'
			});
		}

		try {
			const formData = await request.formData();
			const id = formData.get('id') as string;
			const status = formData.get('status') as
				| 'Pendente'
				| 'Sendo Atendido'
				| 'Finalizado'
				| 'Pago'
				| 'Cancelado'
				| 'Aguardando Pagamento';
			const comprovante = formData.get('comprovante') as File;
			if (
				![
					'Pendente',
					'Sendo Atendido',
					'Finalizado',
					'Pago',
					'Cancelado',
					'Aguardando Pagamento'
				].includes(status)
			) {
				return fail(400, {
					success: false,
					message: 'Status inválido'
				});
			}

			const ValidarComprovante = (comprovante: File) => {
				if (!comprovante) return 'Comprovante é obrigatório';
				const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
				if (!tiposPermitidos.includes(comprovante.type)) return 'Formato de imagem inválido';
				const maxSize = 2 * 1024 * 1024; // 2MB
				if (comprovante.size > maxSize) return 'Comprovante deve ter no máximo 2MB';
				return null;
			};

			const erroComprovante = ValidarComprovante(comprovante);
			if (erroComprovante) {
				return fail(400, {
					success: false,
					message: erroComprovante
				});
			}

			const processarComprovante = async (arquivo: File) => {
				const buffer = await arquivo.arrayBuffer();
				const base64 = Buffer.from(buffer).toString('base64');
				return `data:${arquivo.type};base64,${base64}`;
			};

			const comprovanteBase64 = await processarComprovante(comprovante);

			const lead = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
			if (!lead || lead.length === 0) {
				return fail(404, {
					success: false,
					message: 'Lead não encontrado ou não autorizado'
				});
			}

			await db
				.update(leadsTable)
				.set({
					status,
					pagoPor: locals.user.email,
					pagoEm: new Date().toISOString(),
					comprovantePagamento: comprovanteBase64
				})
				.where(eq(leadsTable.id, id));

			return {
				success: true,
				message: 'Status atualizado com sucesso'
			};
		} catch (error) {
			console.error('Erro ao atualizar status:', error);
			return fail(500, {
				success: false,
				message: 'Erro ao atualizar status'
			});
		}
	}
};
