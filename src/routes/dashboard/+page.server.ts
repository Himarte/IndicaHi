import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/indicacoes', {
			method: 'GET',
			headers: {
				'API-KEY': SITE_CHAVE_API,
				'Content-Type': 'application/json'
			}
		});

		// Verifica se a resposta é JSON
		const contentType = res.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const leads = await res.json();
			return { leads };
		} else {
			// Lidar com resposta inesperada (não JSON)
			console.error('A resposta não é JSON:', await res.text());
			return { leads: [] };
		}
	} catch (err) {
		console.error('Erro ao buscar leads:', err);
		return { leads: [] };
	}
};
