import type { Cookies } from '@sveltejs/kit';
import type { Lucia } from 'lucia';

export const GITHUB_OAUTH_STATE_COOKIE_NAME = 'githubOauthState';
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'googleOauthState';
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = 'googleOauthCodeVerifier';

export const PENDING_USER_VERIFICATION_COOKIE_NAME = 'pendingUserVerification';

// Funcao para criar um cookie de sessao
export const createSessionCookie = async (lucia: Lucia, userId: string, cookies: Cookies) => {
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

// Funcao para deletar um cookie de sessao
export const deleteSessionCookie = async (lucia: Lucia, cookies: Cookies) => {
	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

// Regex para validar email
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const focarConfirmPasswordErrada = () => {
	const passwordElement = document.getElementById('confirmPassword');
	if (passwordElement) {
		passwordElement.focus();
	}
};

// Valida CPF para paenas numeros e coloca a Mascara
export function validationCpf(v: string): string {
	v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
	v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
	v = v.replace(/(\d{3})(\d)/, '$1.$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
	//de novo (para o segundo bloco de números)
	v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); //Coloca um hífen entre o terceiro e o quarto dígitos
	return v;
}
//  Valida Celular para paenas numeros e coloca a Mascara
export function validationCelular(v: string): string {
	v = v.replace(/\D/g, ''); //Remove tudo o que não é dígito
	v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); //Coloca parênteses em volta dos dois primeiros dígitos
	v = v.replace(/(\d)(\d{4})$/, '$1-$2'); //Coloca hífen antes dos últimos 4 dígitos
	return v;
}
