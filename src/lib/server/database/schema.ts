import { pgTable, text, timestamp, varchar, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Define enums
export const jobEnum = pgEnum('job', [
	'Vendedor Externo',
	'Vendedor Interno',
	'Financeiro',
	'Admin'
]);
export const pixTypeEnum = pgEnum('pix_type', ['cpf', 'cnpj', 'email', 'telefone']);
export const statusEnum = pgEnum('status', [
	'Pendente',
	'Sendo Atendido',
	'Finalizado',
	'Sem Sucesso'
]);

export const userTable = pgTable('user', {
	id: text('id').primaryKey().notNull(),
	provider: varchar('provider_id'),
	provider_user_id: varchar('provider_user_id'),
	avatarUrl: varchar('avatar_url'),
	name: varchar('name').notNull(),
	email: varchar('email').notNull(),
	job: jobEnum('job').default('Vendedor Externo'),
	cpf: varchar('cpf', { length: 11 }).unique(),
	telefone: varchar('telefone', { length: 11 }),
	promoCode: varchar('promo_code', { length: 15 }).unique(),
	pixType: pixTypeEnum('pix_type'),
	pixCode: text('pix_code').unique(),
	cep: varchar('cep', { length: 8 }),
	rua: varchar('rua', { length: 256 }),
	numeroCasa: integer('numero_casa'),
	complemento: varchar('complemento', { length: 256 }),
	bairro: varchar('bairro', { length: 256 }),
	cidade: varchar('cidade', { length: 256 }),
	estado: varchar('estado', { length: 2 }),
	status: boolean('status').default(true),
	createdAt: timestamp('created_at', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow()
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const leadsTable = pgTable('leads', {
	id: varchar('id').primaryKey().notNull(),
	fullName: varchar('full_name'),
	cpfCnpj: varchar('cpf_cnpj', { length: 14 }),
	status: statusEnum('status').default('Pendente').notNull(),
	promoCode: varchar('promo_code', { length: 15 }),
	createdAt: timestamp('created_at', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow(),
	attendedAt: timestamp('attended_at', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	userIdPromoCode: text('user_id_promocode').references(() => userTable.id)
});

// Define types for insert schemas
export type UserInsertSchema = typeof userTable.$inferInsert;
export type LeadsSchema = typeof leadsTable.$inferInsert;
