import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	// Fetch Leads finalizados
	const userIndicadoresLeads = fetch('/api/indicacoes/financeiro', {
		method: 'GET',
		headers: {
			'API-KEY': SITE_CHAVE_API,
			'Content-Type': 'application/json'
		}
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return [];
		});

	// console.log('User indicadores: ', userIndicadoresLeads);

	return {
		userIndicadoresLeads
	};
};
