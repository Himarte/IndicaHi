import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database/db.server';
import { leadsComprovanteTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

// Função de validação de auth
const validateAuth = (locals: App.Locals) => {
	if (!locals.user) {
		return { success: false, error: 'Usuário não autenticado' };
	}

	if (locals.user.job !== 'Admin') {
		return { success: false, error: 'Acesso negado. Apenas administradores têm permissão.' };
	}

	return { success: true, user: locals.user };
};

// GET: Verificar se existe comprovante
export const GET: RequestHandler = async ({ params, locals }) => {
	try {
		// Verificar autenticação e permissão de admin
		const authResult = validateAuth(locals);
		if (!authResult.success) {
			return error(401, { message: authResult.error || 'Erro de autenticação' });
		}

		const { leadId } = params;
		if (!leadId) {
			return error(400, { message: 'ID do lead é obrigatório' });
		}

		// Verificar se existe comprovante no banco
		const comprovante = await db
			.select({ comprovante: leadsComprovanteTable.comprovante })
			.from(leadsComprovanteTable)
			.where(eq(leadsComprovanteTable.leadsId, leadId))
			.limit(1);

		if (!comprovante.length) {
			return error(404, { message: 'Comprovante não encontrado' });
		}

		return json({
			success: true,
			exists: true,
			comprovante: comprovante[0].comprovante
		});
	} catch (err) {
		console.error('Erro ao verificar comprovante:', err);
		return error(500, { message: 'Erro interno do servidor' });
	}
};

// DELETE: Excluir comprovante
export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		// Verificar autenticação e permissão de admin
		const authResult = validateAuth(locals);
		if (!authResult.success) {
			return error(401, { message: authResult.error || 'Erro de autenticação' });
		}

		const { leadId } = params;
		if (!leadId) {
			return error(400, { message: 'ID do lead é obrigatório' });
		}

		// Excluir comprovante do banco
		await db.delete(leadsComprovanteTable).where(eq(leadsComprovanteTable.leadsId, leadId));

		return json({
			success: true,
			message: 'Comprovante excluído com sucesso'
		});
	} catch (err) {
		console.error('Erro ao excluir comprovante:', err);
		return error(500, { message: 'Erro interno do servidor' });
	}
};

// POST: Anexar/substituir comprovante
export const POST: RequestHandler = async ({ request, params, locals }) => {
	try {
		// Verificar autenticação e permissão de admin
		const authResult = validateAuth(locals);
		if (!authResult.success) {
			return error(401, { message: authResult.error || 'Erro de autenticação' });
		}

		const { leadId } = params;
		if (!leadId) {
			return error(400, { message: 'ID do lead é obrigatório' });
		}

		const formData = await request.formData();
		const file = formData.get('comprovante') as File;

		if (!file) {
			return error(400, { message: 'Arquivo é obrigatório' });
		}

		// Validações do arquivo
		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
		if (!allowedTypes.includes(file.type)) {
			return error(400, { message: 'Tipo de arquivo inválido. Use JPG, PNG, WEBP ou PDF' });
		}

		if (file.size > 5 * 1024 * 1024) {
			// 5MB
			return error(400, { message: 'Arquivo deve ter no máximo 5MB' });
		}

		// Converter arquivo para base64 (seguindo o padrão do sistema)
		const arrayBuffer = await file.arrayBuffer();
		const base64 = Buffer.from(arrayBuffer).toString('base64');
		const comprovanteBase64 = `data:${file.type};base64,${base64}`;

		// Executar transação para excluir anterior e inserir novo
		await db.transaction(async (tx) => {
			// Excluir comprovante anterior se existir
			await tx.delete(leadsComprovanteTable).where(eq(leadsComprovanteTable.leadsId, leadId));

			// Inserir novo comprovante
			await tx.insert(leadsComprovanteTable).values({
				id: crypto.randomUUID(),
				leadsId: leadId,
				comprovante: comprovanteBase64
			});
		});

		return json({
			success: true,
			message: 'Comprovante anexado com sucesso'
		});
	} catch (err) {
		console.error('Erro ao anexar comprovante:', err);
		return error(500, { message: 'Erro interno do servidor' });
	}
};
