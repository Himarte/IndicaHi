import type { userTable } from '$lib/server/database/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type VendedorInterno = Pick<
	InferSelectModel<typeof userTable>,
	'id' | 'name' | 'email' | 'telefone' | 'cpf' | 'criadoEm'
>;

export interface Pagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

export interface VendedoresResponse {
	vendedores: VendedorInterno[];
	pagination: Pagination;
	error?: string | null;
}

export interface PageData extends VendedoresResponse {}
