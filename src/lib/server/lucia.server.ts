import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { dev } from '$app/environment';

import { db } from './database/db.server';
import { sessionTable, userTable } from './database/schema';

const dbAdapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

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
			lastName: userTable.lastName,
			email: userTable.email,
			job: userTable.job,
			cpf: userTable.cpf,
			telefone: userTable.telefone,
			promoCode: userTable.promoCode
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
			lastName: string;
			email: string;
			job: string;
			cpf: string;
			telefone: string;
			promoCode: string;
		};
	}
}
