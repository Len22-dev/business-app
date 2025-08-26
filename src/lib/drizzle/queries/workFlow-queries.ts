import { eq,  desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { workFlows, workFlowSteps } from '../schema/workFlow-schema';
import { z } from 'zod';
import { createWorkFlowSchema, createWorkFlowStepSchema } from '@/lib/zod/workFlowSchema';

// Zod schemas for validation
// const createWorkFlowSchema = z.object({
  // businessId: z.string().uuid(),
  // name: z.string().min(1),
  // description: z.string().optional(),
  // type: z.enum(['approval', 'review', 'notification']),
  // isActive: z.boolean().optional(),
// });

const updateWorkFlowSchema = createWorkFlowSchema.partial();

// const createWorkFlowStepSchema = z.object({
  // workFlowId: z.string().uuid(),
  // name: z.string().min(1),
  // description: z.string().optional(),
  // stepNumber: z.number().int().min(1),
  // stepType: z.enum(['approval', 'review', 'notification']),
  // isActive: z.boolean().optional(),
// });

const updateWorkFlowStepSchema = createWorkFlowStepSchema.partial();

export const workflowQueries = {
  // WorkFlow CRUD
  async createWorkFlow(data: z.infer<typeof createWorkFlowSchema>) {
    const validated = createWorkFlowSchema.parse(data);
    const [workflow] = await db.insert(workFlows).values({
      ...validated,
      isActive: validated.isActive ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return workflow;
  },
  async getWorkFlowById(id: string) {
    return db.query.workFlows.findFirst({
      where: eq(workFlows.id, id),
      with: { workFlowSteps: true },
    });
  },
  async getWorkFlowsByBusiness(businessId: string) {
    return db.query.workFlows.findMany({
      where: eq(workFlows.businessId, businessId),
      orderBy: [desc(workFlows.created_at)],
      with: { workFlowSteps: true },
    });
  },
  async updateWorkFlow(id: string, data: z.infer<typeof updateWorkFlowSchema>) {
    const validated = updateWorkFlowSchema.parse(data);
    const [workflow] = await db.update(workFlows)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(workFlows.id, id))
      .returning();
    return workflow;
  },
  async deleteWorkFlow(id: string) {
    await db.delete(workFlows).where(eq(workFlows.id, id));
    return true;
  },
  // WorkFlowStep CRUD
  async createWorkFlowStep(data: z.infer<typeof createWorkFlowStepSchema>) {
    const validated = createWorkFlowStepSchema.parse(data);
    const [step] = await db.insert(workFlowSteps).values({
      ...validated,
      isActive: validated.isActive ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return step;
  },
  async getWorkFlowStepById(id: string) {
    return db.query.workFlowSteps.findFirst({
      where: eq(workFlowSteps.id, id),
      with: { workFlow: true },
    });
  },
  async getWorkFlowStepsByWorkFlow(workFlowId: string) {
    return db.query.workFlowSteps.findMany({
      where: eq(workFlowSteps.workFlowId, workFlowId),
      orderBy: [desc(workFlowSteps.stepNumber)],
    });
  },
  async updateWorkFlowStep(id: string, data: z.infer<typeof updateWorkFlowStepSchema>) {
    const validated = updateWorkFlowStepSchema.parse(data);
    const [step] = await db.update(workFlowSteps)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(workFlowSteps.id, id))
      .returning();
    return step;
  },
  async deleteWorkFlowStep(id: string) {
    await db.delete(workFlowSteps).where(eq(workFlowSteps.id, id));
    return true;
  },
};
