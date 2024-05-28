import type { RequestEvent } from '@sveltejs/kit';

import { discord } from '$lib/server/lucia.server';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('discord_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}
	const tokens = await discord.validateAuthorizationCode(code);
	console.log('Tokens:', tokens);

	return new Response(null, {
		status: 200
	});
}
