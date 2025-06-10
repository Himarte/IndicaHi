import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session, user } }) => {
	return {
		isUserLoggedIn: session !== null,
		user: user
	};
};
