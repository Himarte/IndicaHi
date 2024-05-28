import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { GitHub, Google, Discord } from 'arctic';
import { db } from './database/db.server';
import { sessionTable, userTable } from './database/schema';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_REDIRECT_URL,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URL
} from '$env/static/private';

const dbAdapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

// CLiente do github
export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
// Cliente do google
export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_CLIENT_REDIRECT_URL
);
// Cliente do discord
export const discord = new Discord(DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URL);

export const lucia = new Lucia(dbAdapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	// Campos que quero ter acesso através dos cookies
	getUserAttributes: (userTable) => {
		return {
			id: userTable.id,
			name: userTable.name,
			avatarUrl: userTable.avatarUrl,
			email: userTable.email,
			job: userTable.job,
			cpf: userTable.cpf,
			telefone: userTable.telefone,
			promoCode: userTable.promoCode,
			pixType: userTable.pixType,
			pixCode: userTable.pixCode,
			cep: userTable.cep,
			rua: userTable.rua,
			numeroCasa: userTable.numeroCasa,
			complemento: userTable.complemento,
			bairro: userTable.bairro,
			cidade: userTable.cidade,
			estado: userTable.estado,
			status: userTable.status
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;

		// Dados que tenho acesso através dos cookies
		DatabaseUserAttributes: {
			id: string;
			name: string;
			avatarUrl: string;
			email: string;
			job: string;
			cpf: string;
			telefone: string;
			promoCode: string;
			pixType: string;
			pixCode: string;
			cep: string;
			rua: string;
			numeroCasa: number;
			complemento: string;
			bairro: string;
			cidade: string;
			estado: string;
			status: boolean;
		};
	}
}
export type userDataFromCookies = {
	id: string;
	name: string;
	avatarUrl: string;
	email: string;
	job: string;
	cpf: string;
	telefone: string;
	promoCode: string;
	pixType: string;
	pixCode: string;
	cep: string;
	rua: string;
	numeroCasa: number;
	complemento: string;
	bairro: string;
	cidade: string;
	estado: string;
	status: boolean;
};
