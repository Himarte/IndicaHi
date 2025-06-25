import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { motivoCancelado, leadsTable } from '$lib/server/database/schema';
import { eq, and } from 'drizzle-orm';

// GET - Buscar motivo do cancelamento
export const GET: RequestHandler = async ({ params, locals }) => {
	// Verificar se o usuário é admin
	if (!locals.user?.job?.includes('Admin')) {
		return json({ error: 'Acesso negado' }, { status: 403 });
	}

	try {
		const leadId = params.leadId;

		if (!leadId) {
			return json({ error: 'ID do lead é obrigatório' }, { status: 400 });
		}

		// Buscar o motivo do cancelamento
		const result = await db
			.select({
				motivo: motivoCancelado.motivo,
				leadStatus: leadsTable.status
			})
			.from(motivoCancelado)
			.innerJoin(leadsTable, eq(motivoCancelado.leadId, leadsTable.id))
			.where(and(eq(motivoCancelado.leadId, leadId), eq(leadsTable.status, 'Cancelado')))
			.limit(1);

		if (!result || result.length === 0) {
			return json({ error: 'Motivo não encontrado' }, { status: 404 });
		}

		return json({ motivo: result[0].motivo });
	} catch (error) {
		console.error('Erro ao buscar motivo:', error);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
};

// POST - Salvar/atualizar motivo do cancelamento
export const POST: RequestHandler = async ({ params, request, locals }) => {
	// Verificar se o usuário é admin
	if (!locals.user?.job?.includes('Admin')) {
		return json({ error: 'Acesso negado' }, { status: 403 });
	}

	try {
		const leadId = params.leadId;
		const { motivo } = await request.json();

		if (!leadId || !motivo?.trim()) {
			return json({ error: 'ID do lead e motivo são obrigatórios' }, { status: 400 });
		}

		// Verificar se o lead existe e está cancelado
		const lead = await db
			.select()
			.from(leadsTable)
			.where(and(eq(leadsTable.id, leadId), eq(leadsTable.status, 'Cancelado')))
			.limit(1);

		if (!lead || lead.length === 0) {
			return json({ error: 'Lead não encontrado ou não está cancelado' }, { status: 404 });
		}

		// Verificar se já existe um motivo para atualizar ou criar novo
		const motivoExistente = await db
			.select()
			.from(motivoCancelado)
			.where(eq(motivoCancelado.leadId, leadId))
			.limit(1);

		if (motivoExistente && motivoExistente.length > 0) {
			// Atualizar motivo existente
			await db
				.update(motivoCancelado)
				.set({ motivo: motivo.trim() })
				.where(eq(motivoCancelado.leadId, leadId));
		} else {
			// Criar novo motivo
			await db.insert(motivoCancelado).values({
				id: crypto.randomUUID(),
				leadId,
				motivo: motivo.trim()
			});
		}

		return json({ success: true, message: 'Motivo salvo com sucesso' });
	} catch (error) {
		console.error('Erro ao salvar motivo:', error);
		return json({ error: 'Erro interno do servidor' }, { status: 500 });
	}
};
