import { pgTable, varchar, uuid, jsonb, text, boolean, index, timestamp } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { users } from "./users-schema";
import { relations } from "drizzle-orm";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// Reports
export const reports = pgTable('reports', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    type: varchar('type', { length: 50 }).notNull(), // 'profit_loss', 'balance_sheet', 'cash_flow', etc.
    configuration: jsonb('configuration'),
    isPublic: boolean('is_public').default(false),
    createdBy: uuid('created_by').references(() => users.id),
    ...timestamps,
  }, (table) => ({
    businessReportIdx: index('reports_business_idx').on(table.businessId),
  }));

  export const reportsRelations = relations(reports, ({ one }) => ({
    business: one(businesses, {
      fields: [reports.businessId],
      references: [businesses.id],
    }),
    createdBy: one(users, {
      fields: [reports.createdBy],
      references: [users.id],
    }),
  }));