import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { notifications } from '../schema/notifications-schema';
import { z } from 'zod';

const createNotificationSchema = z.object({
  businessId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'error', 'success']).optional(),
  isRead: z.boolean().optional(),
  actionUrl: z.string().optional(),
  metadata: z.any().optional(),
  expiresAt: z.date().optional(),
});

const updateNotificationSchema = createNotificationSchema.partial();

export const notificationQueries = {
  async createNotification(data: z.infer<typeof createNotificationSchema>) {
    const validated = createNotificationSchema.parse(data);
    const [notification] = await db.insert(notifications).values({
      ...validated,
      isRead: validated.isRead ?? false,
      createdAt: new Date(),
    }).returning();
    return notification;
  },
  async getNotificationById(id: string) {
    return db.query.notifications.findFirst({
      where: eq(notifications.id, id),
    });
  },
  async getNotificationsByBusiness(businessId: string) {
    return db.query.notifications.findMany({
      where: eq(notifications.businessId, businessId),
      orderBy: [desc(notifications.createdAt)],
    });
  },
  async getNotificationsByUser(userId: string) {
    return db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
    });
  },
  async updateNotification(id: string, data: z.infer<typeof updateNotificationSchema>) {
    const validated = updateNotificationSchema.parse(data);
    const [notification] = await db.update(notifications)
      .set({ ...validated })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  },
  async deleteNotification(id: string) {
    await db.delete(notifications).where(eq(notifications.id, id));
    return true;
  },
}; 