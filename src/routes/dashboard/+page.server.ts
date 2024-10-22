import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database/db.server';
import { leadsTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userPromoCode = locals?.user?.promoCode;

	// Verifica se o usuário está autenticado e possui um promoCode
	if (!userPromoCode) {
		return {
			leads: [],
			message: 'Usuário não autenticado ou sem promoCode'
		};
	}

	try {
		// Consulta ao banco de dados
		const leads = await db.select().from(leadsTable).where(eq(leadsTable.promoCode, userPromoCode));

		return { leads };
	} catch (err) {
		console.error('Erro ao buscar leads:', err);
		return {
			leads: [],
			message: 'Erro interno do servidor'
		};
	}
};
