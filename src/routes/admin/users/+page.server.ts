import type { PageServerLoad } from './$types';
import { SITE_CHAVE_API } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, locals }) => {
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

	console.log('vendedoresInternos', vendedoresInternos);
	console.log('vendedoresExternos', vendedoresExternos);
	console.log('administradores', administradores);
	console.log('financeiro', financeiro);

	return {
		usuarios: {
			vendedoresInternos,
			vendedoresExternos,
			administradores,
			financeiro
		}
	};
};
