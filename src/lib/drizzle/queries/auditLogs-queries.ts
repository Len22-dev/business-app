import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { auditLogs } from '../schema/auditLogs-schema';
import { z } from 'zod';
import { createAuditLogSchema, updateAuditLogSchema } from '@/lib/zod/auditalogSchema';

// const createAuditLogSchema = z.object({
//   businessId: z.string().uuid(),
//   userId: z.string().uuid().optional(),
//   action: z.string().min(1),
//   tableName: z.string().min(1),
//   recordId: z.string().uuid(),
//   oldValues: z.any().optional(),
//   newValues: z.any().optional(),
//   ipAddress: z.string().optional(),
//   userAgent: z.string().optional(),
//   createdAt: z.date().optional(),
// });

//const updateAuditLogSchema = createAuditLogSchema.partial();

export const auditLogsQueries = {
  async createAuditLog(data: z.infer<typeof createAuditLogSchema>) {
    const validated = createAuditLogSchema.parse(data);
    const [log] = await db.insert(auditLogs).values({
      ...validated,
      createdAt: new Date(),
    }).returning();
    return log;
  },
  async getAuditLogById(id: string) {
    return db.query.auditLogs.findFirst({
      where: eq(auditLogs.id, id),
    });
  },
  async getAuditLogsByBusiness(businessId: string) {
    return db.query.auditLogs.findMany({
      where: eq(auditLogs.businessId, businessId),
      orderBy: [desc(auditLogs.createdAt)],
    });
  },
  async updateAuditLog(id: string, data: z.infer<typeof updateAuditLogSchema>) {
    const validated = updateAuditLogSchema.parse(data);
    const [log] = await db.update(auditLogs)
      .set({ ...validated })
      .where(eq(auditLogs.id, id))
      .returning();
    return log;
  },
  async deleteAuditLog(id: string) {
    await db.delete(auditLogs).where(eq(auditLogs.id, id));
    return true;
  },
};
