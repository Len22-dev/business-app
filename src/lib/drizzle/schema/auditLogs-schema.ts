import { pgTable, uuid, varchar, jsonb, text, timestamp, index } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { users } from "./users-schema";
import { relations } from "drizzle-orm";


// Audit Logs
export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id),
    actionType: varchar('action', { length: 50 }).notNull(), // 'create', 'update', 'delete'
    resourceType: varchar('resource_type', { length: 100 }).notNull(), // Invoice, Customer, Product, etc.
    resourceId: uuid('resource_id'),
    tableName: varchar('table_name', { length: 50 }).notNull(), // Finance, Sales, Inventory, etc.
    recordId: uuid('record_id').notNull(),
    transactionId: uuid('transaction_id'),
    oldValues: jsonb('old_values'),
    newValues: jsonb('new_values'),
    changedFields: jsonb('changed_fields'), // Array of fields that were changed
    ipAddress: varchar('ip_address', { length: 45 }),
    result: varchar('result', { length: 20 }), // SUCCESS, FAILURE, PARTIAL
    userAgent: text('user_agent'),
    errorCode: varchar('error_code', { length: 50 }),
    geographicLocation: varchar('geographic_location', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
  }, (table) => ({
    businessAuditIdx: index('audit_logs_business_idx').on(table.businessId),
    recordAuditIdx: index('audit_logs_record_idx').on(table.tableName, table.recordId),
    userActionIdx: index('audit_logs_user_action_idx').on(table.userId, table.actionType),
    resourceIdx: index('audit_logs_resource_idx').on(table.resourceType, table.resourceId),
    transactionIdx: index('audit_logs_transaction_idx').on(table.transactionId),
}));
 

  export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    business: one(businesses, {
      fields: [auditLogs.businessId],
      references: [businesses.id],
    }),
    user: one(users, {
      fields: [auditLogs.userId],
      references: [users.id],
    }),
  }));

  