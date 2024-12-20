import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import type { PageData } from './types';

export const load = (async ({ fetch, locals }) => {
	if (!locals.user || locals.user.job !== 'Admin') {
		return {
			administradores: [],
			error: 'Não autorizado'
		} satisfies PageData;
	}

	try {
		const response = await fetch('/api/admin/listar/administradores', {
			headers: {
				'API-KEY': SITE_CHAVE_API
			}
		});

		if (!response.ok) {
			throw new Error('Erro ao carregar dados');
		}

		const data = await response.json();
		return {
			administradores: data.administradores,
			error: null
		} satisfies PageData;
	} catch (error) {
		console.error('Erro ao carregar administradores:', error);
		return {
			administradores: [],
			error: 'Erro ao carregar dados dos administradores'
		} satisfies PageData;
	}
}) satisfies PageServerLoad;
