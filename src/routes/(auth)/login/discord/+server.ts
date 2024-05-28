import { generateState } from 'arctic';
import { redirect } from '@sveltejs/kit';
import { discord } from '$lib/server/lucia.server';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	console.log('AQUI STATE', state);

	const url: URL = await discord.createAuthorizationURL(state, {
		scopes: ['identify', 'email']
	});
	console.log('AQUI URL', url);

	event.cookies.set('discord_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	return redirect(302, url.href);
}
