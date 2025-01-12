import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';
import type { AdminPageData } from '$lib/types/admin';

export const load: PageServerLoad<AdminPageData> = async ({ fetch, locals }) => {
	if (!locals.user?.job?.includes('Admin')) {
		return {
			usuarios: {
				vendedoresInternos: [],
				vendedoresExternos: [],
				administradores: [],
				financeiro: []
			}
		};
	}

	const fetchUsuariosPorCargo = async (cargo: string) => {
		try {
			const response = await fetch(`/api/admin/usuarios/${cargo}`, {
				method: 'GET',
				headers: {
					'API-KEY': SITE_CHAVE_API,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Erro ao buscar usuários ${cargo}`);
			}

			return await response.json();
		} catch (err) {
			console.error(`Erro ao buscar usuários ${cargo}:`, err);
			return [];
		}
	};

	const [vendedoresInternos, vendedoresExternos, administradores, financeiro] = await Promise.all([
		fetchUsuariosPorCargo('vendedores_internos'),
		fetchUsuariosPorCargo('vendedores_externos'),
		fetchUsuariosPorCargo('administrador'),
		fetchUsuariosPorCargo('financeiro')
	]);

	return {
		usuarios: {
			vendedoresInternos,
			vendedoresExternos,
			administradores,
			financeiro
		}
	};
};
