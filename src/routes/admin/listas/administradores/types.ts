import type { userTable } from '$lib/server/database/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type Administrador = Pick<
	InferSelectModel<typeof userTable>,
	'id' | 'name' | 'email' | 'telefone' | 'cpf' | 'criadoEm'
>;

export interface AdminResponse {
	administradores: Administrador[];
	error?: string | null;
}

export interface PageData extends AdminResponse {}
