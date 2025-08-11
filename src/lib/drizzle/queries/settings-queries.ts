import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { settings } from '../schema/settings-schema';
import { z } from 'zod';

const createSettingsSchema = z.object({
  businessId: z.string().uuid(),
  key: z.string().min(1),
  value: z.any().optional(),
  description: z.string().optional(),
});

const updateSettingsSchema = createSettingsSchema.partial();

export const settingsQueries = {
  async createSettings(data: z.infer<typeof createSettingsSchema>) {
    const validated = createSettingsSchema.parse(data);
    const [setting] = await db.insert(settings).values({
      ...validated,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return setting;
  },
  async getSettingsById(id: string) {
    return db.query.settings.findFirst({
      where: eq(settings.id, id),
    });
  },
  async getSettingsByBusiness(businessId: string) {
    return db.query.settings.findMany({
      where: eq(settings.businessId, businessId),
      orderBy: [desc(settings.created_at)],
    });
  },
  async updateSettings(id: string, data: z.infer<typeof updateSettingsSchema>) {
    const validated = updateSettingsSchema.parse(data);
    const [setting] = await db.update(settings)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(settings.id, id))
      .returning();
    return setting;
  },
  async deleteSettings(id: string) {
    await db.delete(settings).where(eq(settings.id, id));
    return true;
  },
};
