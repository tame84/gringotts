import { pgTable, integer, uuid, timestamp, text, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const sessionsStatesTable = pgTable('sessions_states', {
	state: uuid('state').primaryKey().defaultRandom(),
	maxConsentValidity: integer('max_consent_validity').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const psuTypeEnum = pgEnum('psu_type', ['business', 'personal']);

export const sessionsTable = pgTable('sessions', {
	id: text('id').unique().notNull(),
	slug: text('slug').primaryKey(),
	maxConsentValidty: integer('max_consent_validity').notNull(),
	psuType: psuTypeEnum('psu_type').notNull(),
	aspsp: jsonb('aspsp').notNull().$type<{ name: string; country: string }>(),
	linkedAccountsCount: integer('linked_accounts_count').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	validUntil: timestamp('valid_until', { withTimezone: true }).notNull()
});

export const accountsTable = pgTable('accounts', {
	id: text('id').unique().notNull(),
	sessionId: text('session_id')
		.notNull()
		.references(() => sessionsTable.id)
});
