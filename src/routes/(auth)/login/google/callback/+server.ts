import type { RequestHandler } from './$types';
import { OAuth2RequestError } from 'arctic';

import {
	GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME,
	GOOGLE_OAUTH_STATE_COOKIE_NAME
} from '$lib/server/authUtils.server';
import * as auth from '$lib/server/auth';
import { google } from '$lib/server/oauth';
import { generateId } from '$lib/server/utils';
import { db } from '$lib/server/database/db.server';
import { userTable } from '$lib/server/database/schema';
import { emailIsUsed } from '$lib/server/database/utils/user.server';
import { and, eq } from 'drizzle-orm';

type GoogleUser = {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
};

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME);
	const storedCodeVerifier = event.cookies.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME);

	// Validate OAuth state and code verifier
	if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
		return new Response('Invalid OAuth state or code verifier', {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`
			}
		});

		// Resposta do google ja em json (verificar o type)
		const googleUser = (await googleUserResponse.json()) as GoogleUser;

		if (!googleUser.email) {
			return new Response('No primary email address', {
				status: 400
			});
		}

		if (!googleUser.email_verified) {
			return new Response('Email nao verificado', {
				status: 400
			});
		}

		// Check if the user already exists
		const existingEmail = await emailIsUsed(googleUser.email);

		if (existingEmail) {
			// pegar o id do usuario, e criar um cookie de sessao
			const existeEmailEOauth = await db
				.select({ id: userTable.id })
				.from(userTable)
				.where(
					and(
						eq(userTable.email, googleUser.email),
						eq(userTable.provider, 'google'),
						eq(userTable.provider_user_id, googleUser.sub)
					)
				);

			if (!existeEmailEOauth || existeEmailEOauth.length === 0) {
				// Create a new user and their OAuth account
				const userId = googleUser.email + generateId(10);

				const newUser = await db.insert(userTable).values({
					id: userId,
					provider: 'google',
					provider_user_id: googleUser.sub,
					name: googleUser.name,
					email: googleUser.email,
					avatarUrl: googleUser.picture,
					job: 'Vendedor Externo',
					promoCode: generateId(8)
				});

				if (!newUser) {
					return new Response('Erro ao registrar usuario', {
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
			const session = await auth.createSession(sessionToken, existeEmailEOauth[0].id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			// Create a new user and their OAuth account
			const userId = googleUser.email + generateId(10);

			const newUser = await db.insert(userTable).values({
				id: userId,
				provider: 'google',
				provider_user_id: googleUser.sub,
				name: googleUser.name,
				email: googleUser.email,
				avatarUrl: googleUser.picture,
				job: 'Vendedor Externo',
				promoCode: generateId(15)
			});

			if (!newUser) {
				return new Response('Erro ao registrar usuario', {
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

		// the specific error message depends on the provider
		if (error instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};
