import { lucia } from '$lib/server/lucia.server';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { deleteSessionCookie } from '$lib/server/authUtils.server';

export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		if (!locals.session?.id) return redirect(302, '/');

		await lucia.invalidateSession(locals.session.id);

		await deleteSessionCookie(lucia, cookies);

		redirect(302, '/');
	}
};
