import type { userDataFromCookies } from '$lib/server/lucia.server';

/**
 * Verifica se o usuário precisa completar o primeiro login
 * Retorna true se estiver faltando algum dado obrigatório
 */
export function needsFirstLogin(userData: userDataFromCookies | null): boolean {
	if (!userData) return false;

	// Verifica se há dados obrigatórios em falta
	return !userData.cpf || !userData.telefone || !userData.pixCode || !userData.pixType;
}

/**
 * Verifica se é um vendedor externo com promo code
 */
export function isExternalSellerWithPromo(userData: userDataFromCookies | null): boolean {
	return !!(userData?.promoCode && userData?.job === 'Vendedor Externo');
}

/**
 * Verifica se o usuário está logado
 */
export function isUserLoggedIn(userData: userDataFromCookies | null): boolean {
	return userData !== null;
}
