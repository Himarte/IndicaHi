import { pgTable, text, timestamp, varchar, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Define enums
export const jobEnum = pgEnum('job', [
	'Vendedor Externo',
	'Vendedor Interno',
	'Financeiro',
	'Admin'
]);
export const pixTypeEnum = pgEnum('pix_type', ['cpf', 'cnpj']);
export const statusEnum = pgEnum('status', [
	'Pendente',
	'Sendo Atendido',
	'Finalizado',
	'Pago',
	'Cancelado',
	'Aguardando Pagamento'
]);
export const modeloEnum = pgEnum('modelo', ['CPF', 'CNPJ']);

export const userTable = pgTable('user', {
	id: varchar('id').primaryKey().notNull(),
	provider: varchar('provider_id').notNull(),
	provider_user_id: varchar('provider_user_id').notNull(),
	avatarUrl: varchar('avatar_url').notNull(),
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
	status: boolean('status').default(true).notNull(),
	criadoEm: timestamp('criado_em', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow(),
	bonusIndicacao: integer('bonus_indicacao').default(0),
	bonusIndicacaoResgatado: integer('bonus_indicacao_resgatado').default(0)
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
	atendidoPor: varchar('atendido_por', { length: 256 }),
	pagoPor: varchar('pago_por', { length: 256 }),
	criadoEm: timestamp('criadoEm', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow(),
	atendidoEm: timestamp('atendido_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	aguardandoPagamentoEm: timestamp('aguardando_pagamento_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	pagoEm: timestamp('pago_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	canceladoEm: timestamp('cancelado_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	finalizadoEm: timestamp('finalizado_em', {
		withTimezone: true,
		precision: 6,
		mode: 'string'
	}),
	userIdPromoCode: text('user_id_promocode').references(() => userTable.id)
});

export const leadsComprovanteTable = pgTable('leads_comprovante', {
	id: varchar('id').primaryKey().notNull(),
	leadsId: varchar('leads_id').references(() => leadsTable.id),
	comprovante: text('comprovante').notNull()
});

export const motivoCancelado = pgTable('motivo_cancelado', {
	id: varchar('id').primaryKey().notNull(),
	motivo: text('motivo').notNull(),
	leadId: varchar('lead_id')
		.notNull()
		.references(() => leadsTable.id, { onDelete: 'cascade' })
		.unique()
});

export const bonusResgateHistoricoTable = pgTable('bonus_resgate_historico', {
	id: varchar('id').primaryKey().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	valorResgatado: integer('valor_resgatado').notNull(),
	resgatadoEm: timestamp('resgatado_em', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow()
});

export const grupoPagamentoTable = pgTable('grupo_pagamento', {
	id: varchar('id').primaryKey().notNull(),
	promoCode: varchar('promo_code', { length: 15 }).notNull(),

	// Dados financeiros
	valorIndicacao: integer('valor_indicacao').notNull(), // valorTotal dos planos
	valorBonus: integer('valor_bonus').default(0).notNull(), // bonus resgatado
	valorTotal: integer('valor_total').notNull(), // soma dos dois acima

	// Status do grupo
	status: statusEnum('status').notNull(), // Pago ou Cancelado
	motivo: text('motivo'), // motivo se cancelado

	// Dados do vendedor
	vendedorId: text('vendedor_id').references(() => userTable.id),
	vendedorNome: varchar('vendedor_nome', { length: 256 }),
	vendedorTelefone: varchar('vendedor_telefone', { length: 11 }),
	vendedorPixCode: text('vendedor_pix_code'),
	vendedorPixType: pixTypeEnum('vendedor_pix_type'),

	// Lista de IDs dos leads (JSON array)
	leadsIds: text('leads_ids').notNull(), // JSON stringified array de IDs
	quantidadeLeads: integer('quantidade_leads').notNull(),

	// Dados dos clientes (JSON)
	clientesData: text('clientes_data').notNull(), // JSON stringified dos dados dos clientes

	// Timestamps
	criadoEm: timestamp('criado_em', { mode: 'string', precision: 6, withTimezone: true })
		.notNull()
		.defaultNow(),
	processadoEm: timestamp('processado_em', { mode: 'string', precision: 6, withTimezone: true }),

	// Dados do processamento
	processadoPor: varchar('processado_por', { length: 256 }), // usuário que processou
	comprovante: text('comprovante') // se pago, base64 do comprovante
});

// Define types for insert schemas
export type UserInsertSchema = typeof userTable.$inferInsert;
export type UserSchema = typeof userTable.$inferSelect;
export type LeadsSchema = typeof leadsTable.$inferSelect;
export type MotivoCanceladoSchema = typeof motivoCancelado.$inferSelect;
export type LeadsComprovanteSchema = typeof leadsComprovanteTable.$inferSelect;
export type BonusResgateHistoricoSchema = typeof bonusResgateHistoricoTable.$inferSelect;
export type BonusResgateHistoricoInsertSchema = typeof bonusResgateHistoricoTable.$inferInsert;
export type GrupoPagamentoSchema = typeof grupoPagamentoTable.$inferSelect;
export type GrupoPagamentoInsertSchema = typeof grupoPagamentoTable.$inferInsert;
