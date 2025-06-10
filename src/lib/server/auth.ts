import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { db } from '$lib/server/database/db.server';
import { sessionTable, userTable } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(25);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export function generateSessionId(token: string): string {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

const sessionExpiresInSeconds = 60 * 60 * 24 * 30; // 30 days

export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
}

export interface User {
	id: string;
	name: string;
	avatarUrl: string;
	email: string;
	job: 'Vendedor Externo' | 'Vendedor Interno' | 'Financeiro' | 'Admin';
	cpf: string | null;
	telefone: string | null;
	promoCode: string | null;
	pixType: 'cpf' | 'cnpj' | null;
	pixCode: string | null;
	cep: string | null;
	rua: string | null;
	numeroCasa: number | null;
	complemento: string | null;
	bairro: string | null;
	cidade: string | null;
	estado: string | null;
	status: boolean;
	bonusIndicacao: number | null;
	bonusIndicacaoResgatado: number | null;
}

export interface SessionValidationResult {
	session: Session;
	user: User;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = generateSessionId(token);
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * sessionExpiresInSeconds)
	};

	await db.insert(sessionTable).values({
		id: session.id,
		userId: session.userId,
		expiresAt: session.expiresAt
	});

	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult | null> {
	const sessionId = generateSessionId(token);

	const result = await db
		.select({
			// Session data
			session: sessionTable,
			// User data
			user: userTable
		})
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId));

	if (result.length < 1) {
		return null;
	}

	const { session: sessionData, user: userData } = result[0];

	const session: Session = {
		id: sessionData.id,
		userId: sessionData.userId,
		expiresAt: sessionData.expiresAt
	};

	const user: User = {
		id: userData.id,
		name: userData.name,
		avatarUrl: userData.avatarUrl,
		email: userData.email,
		job: userData.job || 'Vendedor Externo',
		cpf: userData.cpf,
		telefone: userData.telefone,
		promoCode: userData.promoCode,
		pixType: userData.pixType,
		pixCode: userData.pixCode,
		cep: userData.cep,
		rua: userData.rua,
		numeroCasa: userData.numeroCasa,
		complemento: userData.complemento,
		bairro: userData.bairro,
		cidade: userData.cidade,
		estado: userData.estado,
		status: userData.status,
		bonusIndicacao: userData.bonusIndicacao,
		bonusIndicacaoResgatado: userData.bonusIndicacaoResgatado
	};

	const now = Date.now();
	if (now >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return null;
	}

	// Extend session if it's more than halfway to expiration
	if (now >= session.expiresAt.getTime() - (1000 * sessionExpiresInSeconds) / 2) {
		session.expiresAt = new Date(Date.now() + 1000 * sessionExpiresInSeconds);
		await db
			.update(sessionTable)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessionTable.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

// Cookie utilities
export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	const isProduction = process.env.NODE_ENV === 'production';

	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/',
		secure: isProduction
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	const isProduction = process.env.NODE_ENV === 'production';

	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/',
		secure: isProduction
	});
}
