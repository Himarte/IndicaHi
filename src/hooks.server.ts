import { lucia } from '$lib/server/lucia.server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	//  pegar o ID da sessão vinda do cookie
	const sessionId = event.cookies.get(lucia.sessionCookieName);

	// Se nao tiver ID de sessão, colocar o valor como null e resolver a requisição
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return await resolve(event);
	}

	// Se existire ID de sessao, validar a sessão
	const { session, user } = await lucia.validateSession(sessionId);

	//Se a sessao for fresh ( criada deviso ao tempo de expiração), criar um novo session cookie
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	// se a sessao for invalida, criar uma sessao de cookie em branco e deletar o cookie antigo
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}

	// Redirecionar para o dashboard apenas se a sessao for valida e a requisição nao for para o dashboard ou home
	// if (session && user && event.url.pathname !== '/dashboard' && event.url.pathname !== '/') {
	// 	throw redirect(303, '/dashboard');
	// }

	// Adicionar o usuario e a sessao ao event.locals para que possa ser acessados nos endpoints e pages
	event.locals.user = user;
	event.locals.session = session;

	// Resolver a requisição
	return resolve(event);
};
