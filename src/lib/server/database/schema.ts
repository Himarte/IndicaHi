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
	'Pago',
	'Sem Sucesso'
]);
export const modeloEnum = pgEnum('modelo', ['CPF', 'CNPJ']);

export const userTable = pgTable('user', {
	id: varchar('id').primaryKey().notNull(),
	provider: varchar('provider_id').notNull(),
	provider_user_id: varchar('provider_user_id').notNull(),
	avatarUrl: varchar('avatar_url').notNull(),
	name: varchar('name').notNull(),
	email: varchar('email').notNull(),
	job: jobEnum('job').default('Vendedor Externo').notNull(),
	cpf: varchar('cpf', { length: 11 }).unique().notNull(),
	telefone: varchar('telefone', { length: 11 }).notNull(),
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
	status: boolean('status').default(true).notNull(),
	criadoEm: timestamp('criado_em', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow()
});

export const sessionTable = pgTable('session', {
	id: varchar('id').primaryKey(),
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
	fullName: varchar('full_name').notNull(),
	cpf: varchar('cpf', { length: 14 }),
	cnpj: varchar('cnpj', { length: 18 }),
	status: statusEnum('status').default('Pendente').notNull(),
	promoCode: varchar('promo_code', { length: 15 }),
	telefone: varchar('telefone', { length: 11 }),
	planoNome: varchar('plano_nome', { length: 256 }),
	planoModelo: modeloEnum('plano_modelo'),
	planoMegas: integer('plano_megas'),
	criadoEm: timestamp('criadoEm', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow(),
	atendidoEm: timestamp('atendido_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	finalizadoEm: timestamp('finalizado_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	pagoEm: timestamp('pago_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	userIdPromoCode: text('user_id_promocode').references(() => userTable.id)
});

// Define types for insert schemas
export type UserInsertSchema = typeof userTable.$inferInsert;
export type LeadsSchema = typeof leadsTable.$inferInsert;
