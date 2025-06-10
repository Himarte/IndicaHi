import * as auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = (await auth.validateSessionToken(sessionToken)) ?? {
		session: null,
		user: null
	};

	if (session && session.expiresAt.getTime() > Date.now()) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	}

	if (!session) {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};
