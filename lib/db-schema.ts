import { sql } from 'drizzle-orm'
import { index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export type StoredOrderItem = {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  stripeSessionId: text('stripeSessionId').notNull().unique(),
  status: text('status').notNull().default('pending'),
  items: jsonb('items').$type<StoredOrderItem[]>().notNull(),
  amountTotal: integer('amountTotal').notNull(),
  waitEstimateMinutes: integer('waitEstimateMinutes').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (table) => [index('orders_user_created_at_idx').on(table.userId, sql`${table.createdAt} DESC`)])
