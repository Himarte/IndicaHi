import type { userTable } from '$lib/server/database/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type VendedorExterno = Pick<
	InferSelectModel<typeof userTable>,
	'id' | 'name' | 'email' | 'telefone' | 'cpf' | 'criadoEm' | 'promoCode'
>;

export interface Pagination {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
}

export interface VendedoresExternosResponse {
	vendedores: VendedorExterno[];
	pagination: Pagination;
	error?: string | null;
}

export interface PageData extends VendedoresExternosResponse {}
