import type { PageServerLoad } from './$types';
import { URL_API_SITE, CHAVE_API_SITE } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	const leads = fetch(`${URL_API_SITE}/indicacoes`, {
		headers: {
			'API-KEY': CHAVE_API_SITE
		}
	}).then((response) => response.json());

	return {
		leads
	};
};
