import { pgTable, uuid, text, boolean, index, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { users } from "./users-schema";
import { relations } from "drizzle-orm";

export const notificationTypeEnum = pgEnum('notification_type', ['info', 'warning', 'error', 'success']);

// Notifications
export const notifications = pgTable('notifications', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    message: text('message').notNull(),
    type: notificationTypeEnum('type').default('info'),
    isRead: boolean('is_read').default(false),
    actionUrl: text('action_url'),
    metadata: jsonb('metadata'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
  }, (table) => ({
    businessNotificationIdx: index('notifications_business_idx').on(table.businessId),
    userNotificationIdx: index('notifications_user_idx').on(table.userId),
  }));

  export const notificationsRelations = relations(notifications, ({ one }) => ({
    business: one(businesses, {
      fields: [notifications.businessId],
      references: [businesses.id],
    }),
    user: one(users, {
      fields: [notifications.userId],
      references: [users.id],
    }),
  }));