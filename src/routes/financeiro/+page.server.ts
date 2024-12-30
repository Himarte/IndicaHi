import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';

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
