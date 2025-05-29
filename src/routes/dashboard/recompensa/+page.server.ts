import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// Pega os dados do layout parent
	const { user } = await parent();

	return {
		userData: user
	};
};
