import { pgTable, text, uuid, varchar, boolean, uniqueIndex, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { businessUsers } from "./businesses-schema";
import { notifications } from "./notifications-schema";
import { reports } from "./report-schema";
import { auditLogs } from "./auditLogs-schema";

export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'manager', 'employee', 'accountant']);

 const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}


export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    fullName: text('full_name').notNull(),
    phoneNumber: varchar('phone_number', { length: 20 }),
    avatar: text('avatar'),
    isActive: boolean('is_active').default(true),
    emailVerified: boolean('email_verified').default(false),
    ...timestamps,
  }, (table) => ([
     uniqueIndex('users_email_idx').on(table.email),
  ]));

  export const usersRelations = relations(users, ({ many }) => ({
   businessUsers: many(businessUsers),
   notifications: many(notifications),
   reports: many(reports),
   auditLogs: many(auditLogs),
 })); 