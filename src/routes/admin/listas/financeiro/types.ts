import type { userTable } from '$lib/server/database/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type UsuarioFinanceiro = Pick<
	InferSelectModel<typeof userTable>,
	'id' | 'name' | 'email' | 'telefone' | 'cpf' | 'criadoEm'
>;

export interface PageData {
	usuarios: UsuarioFinanceiro[];
	error?: string | null;
}
