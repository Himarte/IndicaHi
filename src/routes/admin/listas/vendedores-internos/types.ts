import type { userTable } from '$lib/server/database/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type VendedorInterno = Pick<
	InferSelectModel<typeof userTable>,
	'id' | 'name' | 'email' | 'telefone' | 'cpf' | 'criadoEm'
>;

export interface VendedoresResponse {
	vendedores: VendedorInterno[];
	error?: string | null;
}
