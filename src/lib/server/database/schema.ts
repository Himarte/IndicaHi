import { pgTable, text, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	id: text('id').primaryKey().notNull(),
	provider: varchar('provider_id'),
	provider_user_id: varchar('provider_user_id'),
	avatarUrl: varchar('avatar_url'),
	name: varchar('name').notNull(),
	email: varchar('email').notNull(),
	job: varchar('job', {
		enum: ['Vendedor Externo', 'Vendedor Interno', 'Financeiro', 'Admin']
	}).default('Vendedor Externo'),
	cpf: varchar('cpf', { length: 11 }).unique(),
	telefone: varchar('telefone', { length: 11 }),
	promoCode: varchar('promo_code', { length: 15 }).unique(),
	pixType: varchar('pix_type', { enum: ['cpf', 'cnpj', 'email', 'telefone'] }),
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

// TODO: Verificar porque o banco nao desta criando o campo criado em created_at
export const leadsTable = pgTable('leads', {
	id: varchar('id').primaryKey().notNull(), // um identificador único para cada lead
	fullName: varchar('full_name'), // nome completo
	cpfCnpj: varchar('cpf_cnpj', { length: 14 }), // CPF ou CNPJ, dependendo do tipo de pessoa
	status: varchar('status', { enum: ['Pendente', 'Sendo Atendido', 'Finalizado', 'Sem Sucesso'] })
		.default('Pendente')
		.notNull(), // status do lead
	promoCode: varchar('promo_code', { length: 15 }), // código promocional
	createdAt: timestamp('created_at', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow(), // data de criação do lead
	attendedAt: timestamp('attended_at', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}), // data de atendimento do lead
	userIdPromoCode: text('user_id_promocode').references(() => userTable.id) // ID do usuário que possui o promoCode usado
});

export type UserInsertSchema = typeof userTable.$inferInsert;
export type LeadsSchema = typeof leadsTable.$inferInsert;
