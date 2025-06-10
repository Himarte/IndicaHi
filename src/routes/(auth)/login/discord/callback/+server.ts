import type { RequestHandler } from './$types';
import { OAuth2RequestError } from 'arctic';

import * as auth from '$lib/server/auth';
import { discord } from '$lib/server/oauth';
import { generateId } from '$lib/server/utils';
import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
import { emailIsUsed } from '$lib/server/database/utils/user.server';
import { and, eq } from 'drizzle-orm';

type DiscordUser = {
	id: string;
	username: string;
	avatar: string | null;
	discriminator: string;
	public_flags: number;
	flags: number;
	banner: string | null;
	accent_color: number | null;
	global_name: string | null;
	avatar_decoration: string | null;
	banner_color: string | null;
	email: string;
	verified: boolean;
	locale: string;
	mfa_enabled: boolean;
	premium_type: number | null;
};

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('discord_oauth_state');

	// Validate OAuth state and code verifier
	if (!code || !state || !storedState || state !== storedState) {
		return new Response('Invalid OAuth state or code verifier', {
			status: 400
		});
	}

	try {
		const tokens = await discord.validateAuthorizationCode(code, null);

		const discordUserResponse = await fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`
			}
		});

		const discordUser = (await discordUserResponse.json()) as DiscordUser;

		if (!discordUser.email) {
			return new Response('No primary email address', {
				status: 400
			});
		}

		if (!discordUser.verified) {
			return new Response('Email not verified', {
				status: 400
			});
		}

		const existingEmail = await emailIsUsed(discordUser.email);

		if (existingEmail) {
			// Check if the user with the email already exists and matches the provider info
			const existingUser = await db
				.select({ id: userTable.id })
				.from(userTable)
				.where(
					and(
						eq(userTable.email, discordUser.email),
						eq(userTable.provider, 'discord'),
						eq(userTable.provider_user_id, discordUser.id)
					)
				);

			if (existingUser.length === 0) {
				// User exists but not with the same OAuth provider info, create a new user
				const userId = discordUser.email + generateId(10);

				const newUser = await db.insert(userTable).values({
					id: userId,
					provider: 'discord',
					provider_user_id: discordUser.id,
					name: discordUser.username,
					email: discordUser.email,
					avatarUrl: discordUser.avatar
						? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
						: '',
					job: 'Vendedor Externo',
					promoCode: generateId(8)
				});

				if (!newUser) {
					return new Response('Error registering user', {
						status: 500
					});
				}

				const sessionToken = auth.generateSessionToken();
				const session = await auth.createSession(sessionToken, userId);
				auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

				return new Response(null, {
					status: 302,
					headers: {
						location: '/'
					}
				});
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser[0].id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			// Create a new user and their OAuth account
			const userId = discordUser.email + generateId(10);

			const newUser = await db.insert(userTable).values({
				id: userId,
				provider: 'discord',
				provider_user_id: discordUser.id,
				name: discordUser.username,
				email: discordUser.email,
				avatarUrl: discordUser.avatar
					? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
					: '',
				job: 'Vendedor Externo',
				promoCode: generateId(15)
			});

			if (!newUser) {
				return new Response('Error registering user', {
					status: 500
				});
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		}

		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	} catch (error) {
		console.error(error);

		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};
