import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import type { PageData } from './types';

export const load = (async ({ fetch, locals }) => {
	if (!locals.user || locals.user.job !== 'Admin') {
		return {
			usuarios: [],
			error: 'Não autorizado'
		} satisfies PageData;
	}

	try {
		const response = await fetch('/api/admin/financeiro', {
			headers: {
				'API-KEY': SITE_CHAVE_API
			}
		});

		if (!response.ok) {
			throw new Error('Erro ao carregar dados');
		}

		const data = await response.json();
		return {
			usuarios: data.usuarios,
			error: null
		} satisfies PageData;
	} catch (error) {
		console.error('Erro ao carregar usuários:', error);
		return {
			usuarios: [],
			error: 'Erro ao carregar dados dos usuários'
		} satisfies PageData;
	}
}) satisfies PageServerLoad;
