import * as auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session?.id) return redirect(302, '/');

		await auth.invalidateSession(event.locals.session.id);

		auth.deleteSessionTokenCookie(event);

		redirect(302, '/');
	}
};
