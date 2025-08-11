import { businesses } from "./businesses-schema";
import { uuid } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { uniqueIndex, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

    // Settings and Configuration
export const settings = pgTable('settings', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    key: varchar('key', { length: 100 }).notNull(),
    value: jsonb('value'),
    description: text('description'),
    ...timestamps,
  }, (table) => ({
    businessSettingIdx: uniqueIndex('settings_business_key_idx').on(table.businessId, table.key),
  }));

  export const settingsRelations = relations(settings, ({ one }) => ({
    business: one(businesses, {
      fields: [settings.businessId],
      references: [businesses.id],
    }),
  }));
  
  