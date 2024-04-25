import type { PageServerLoad } from './$types';
import { CHAVE_API_SITE, URL_API_SITE } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	const leads = fetch(`${URL_API_SITE}/indicacoes`, {
		headers: {
			'API-KEY': CHAVE_API_SITE,
			'Content-Type': 'application/json'
		}
	})
		.then((res) => res.json())
		.catch(() => []);

	return {
		leads
	};
};
