import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import type { VendedoresResponse } from './types';

export const load: PageServerLoad = async ({ fetch, locals, url }) => {
	if (!locals.user || locals.user.job !== 'Admin') {
		return {
			vendedores: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalItems: 0,
				itemsPerPage: 10
			},
			error: 'Não autorizado'
		} satisfies VendedoresResponse;
	}

	try {
		const page = url.searchParams.get('page') || '1';
		const search = url.searchParams.get('search') || '';

		const response = await fetch(
			`/api/admin/listar/vendedores-internos?page=${page}&search=${search}`,
			{
				headers: {
					'API-KEY': SITE_CHAVE_API
				}
			}
		);

		if (!response.ok) {
			throw new Error('Erro ao carregar dados');
		}

		const data = (await response.json()) as VendedoresResponse;
		return data;
	} catch (error) {
		console.error('Erro ao carregar vendedores:', error);
		return {
			vendedores: [],
			pagination: {
				currentPage: 1,
				totalPages: 0,
				totalItems: 0,
				itemsPerPage: 10
			},
			error: 'Erro ao carregar dados dos vendedores'
		} satisfies VendedoresResponse;
	}
};
