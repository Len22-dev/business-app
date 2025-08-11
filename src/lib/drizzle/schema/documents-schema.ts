import { pgTable, uuid, text, index, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { users } from "./users-schema";
import { relations } from "drizzle-orm";

export const documentTypeEnum = pgEnum('document_type', [
  'invoice', 'receipt', 'contract', 'general', 'avatar'
]);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const documents = pgTable('documents', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    uploadedBy: uuid('uploaded_by').references(() => users.id),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    originalName: varchar('original_name', { length: 255 }).notNull(),
    documentType: documentTypeEnum('document_type').notNull(),
    documentNumber: text('document_number').notNull().unique(),
    title: text('title').notNull(),
    description: text('description'),
    fileUrl: text('file_url').notNull(),
    referenceId: uuid('reference_id'), // e.g. invoice, expense, etc.
    referenceType: text('reference_type'), // e.g. 'invoice', 'expense', etc.
    ...timestamps,
  }, (table) => ({
    businessDocumentIdx: index('documents_business_idx').on(table.businessId),
    documentTypeIdx: index('documents_document_type_idx').on(table.documentType),
    referenceIdx: index('documents_reference_idx').on(table.referenceType, table.referenceId),
  }));

  export const documentsRelations = relations(documents, ({ one }) => ({
    business: one(businesses, {
      fields: [documents.businessId],
      references: [businesses.id],
    }),
    
    uploadedBy: one(users, {
      fields: [documents.uploadedBy],
      references: [users.id],
    }),
  }));
      