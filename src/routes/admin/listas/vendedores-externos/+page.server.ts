import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import type { VendedoresExternosResponse } from './types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user || locals.user.job !== 'Admin') {
		return {
			vendedores: [],
			error: 'Não autorizado'
		};
	}

	try {
		const response = await fetch('/api/admin/listar/vendedores-externos', {
			headers: {
				'API-KEY': SITE_CHAVE_API
			}
		});

		if (!response.ok) {
			throw new Error('Erro ao carregar dados');
		}

		const data = (await response.json()) as VendedoresExternosResponse;
		return data;
	} catch (error) {
		console.error('Erro ao carregar vendedores:', error);
		return {
			vendedores: [],
			error: 'Erro ao carregar dados dos vendedores'
		};
	}
};
