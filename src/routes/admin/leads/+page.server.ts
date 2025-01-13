import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchLeadsByStatus = async (status: string) => {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000);

			const response = await fetch(`/api/admin/leads/${status}`, {
				method: 'GET',
				headers: {
					'API-KEY': SITE_CHAVE_API,
					'Content-Type': 'application/json'
				},
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`Erro ao buscar leads ${status}`);
			}

			const data = await response.json();
			return data;
		} catch (err) {
			console.error(`Erro ao buscar leads ${status}:`, err);
			return [];
		}
	};

	return {
		leads: Promise.all([
			fetchLeadsByStatus('pendentes'),
			fetchLeadsByStatus('em-atendimento'),
			fetchLeadsByStatus('aguardando-pagamento'),
			fetchLeadsByStatus('pagos'),
			fetchLeadsByStatus('finalizados'),
			fetchLeadsByStatus('cancelados')
		]).then(([pendentes, emAtendimento, aguardandoPagamento, pagos, finalizados, cancelados]) => ({
			pendentes,
			emAtendimento,
			aguardandoPagamento,
			pagos,
			finalizados,
			cancelados
		}))
	};
};
