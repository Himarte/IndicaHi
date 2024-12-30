import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import type { PageData } from './types';

export const load = (async ({ fetch, locals, url }) => {
	if (!locals.user || locals.user.job !== 'Admin') {
		return {
			administradores: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalItems: 0,
				itemsPerPage: 10
			},
			error: 'Não autorizado'
		} satisfies PageData;
	}

	try {
		const page = url.searchParams.get('page') || '1';
		const search = url.searchParams.get('search') || '';

		const response = await fetch(
			`/api/admin/listar/administradores?page=${page}&search=${search}`,
			{
				headers: {
					'API-KEY': SITE_CHAVE_API
				}
			}
		);

		if (!response.ok) {
			throw new Error('Erro ao carregar dados');
		}

		const data = await response.json();
		return data as PageData;
	} catch (error) {
		console.error('Erro ao carregar administradores:', error);
		return {
			administradores: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalItems: 0,
				itemsPerPage: 10
			},
			error: 'Erro ao carregar dados dos administradores'
		} satisfies PageData;
	}
}) satisfies PageServerLoad;
