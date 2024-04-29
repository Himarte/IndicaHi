import type { PageServerLoad } from './$types';
import { CHAVE_API_SITE } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	const leads = fetch('/api/indicacoes', {
		method: 'GET',
		headers: {
			'API-KEY': CHAVE_API_SITE,
			'Content-Type': 'application/json'
		}
	})
		.then((res) => res.json())
		.catch((err) => {
			console.error(err);
			return [];
		});

	return {
		leads
	};
};
