import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user
	if (!user) {
		return redirect(301, '/registrar');
	}

	return user
	
 };

