import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { budgets, fiscalPeriods } from '../schema/budgeting-schema';
import { z } from 'zod';

const createBudgetSchema = z.object({
  businessId: z.string().uuid(),
  name: z.string().min(1),
  fiscalPeriodId: z.string().uuid(),
  accountId: z.string().uuid(),
  budgetAmount: z.number().int(),
  actualAmount: z.number().int().optional(),
  varianceAmount: z.number().int().optional(),
  variancePercentage: z.number().int().optional(),
  varianceType: z.string().optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
});

const updateBudgetSchema = createBudgetSchema.partial();

const createFiscalPeriodSchema = z.object({
  businessId: z.string().uuid(),
  year: z.number().int(),
  period: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  isClosed: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const updateFiscalPeriodSchema = createFiscalPeriodSchema.partial();

export const budgetingQueries = {
  // Budgets
  async createBudget(data: z.infer<typeof createBudgetSchema>) {
    const validated = createBudgetSchema.parse(data);
    const [budget] = await db.insert(budgets).values({
      ...validated,
      isActive: validated.isActive ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return budget;
  },
  async getBudgetById(id: string) {
    return db.query.budgets.findFirst({
      where: eq(budgets.id, id),
    });
  },
  async getBudgetsByBusiness(businessId: string) {
    return db.query.budgets.findMany({
      where: eq(budgets.businessId, businessId),
      orderBy: [desc(budgets.created_at)],
    });
  },
  async updateBudget(id: string, data: z.infer<typeof updateBudgetSchema>) {
    const validated = updateBudgetSchema.parse(data);
    const [budget] = await db.update(budgets)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(budgets.id, id))
      .returning();
    return budget;
  },
  async deleteBudget(id: string) {
    await db.delete(budgets).where(eq(budgets.id, id));
    return true;
  },
  // Fiscal Periods
  async createFiscalPeriod(data: z.infer<typeof createFiscalPeriodSchema>) {
    const validated = createFiscalPeriodSchema.parse(data);
    const [period] = await db.insert(fiscalPeriods).values({
      ...validated,
      isClosed: validated.isClosed ?? false,
      isActive: validated.isActive ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return period;
  },
  async getFiscalPeriodById(id: string) {
    return db.query.fiscalPeriods.findFirst({
      where: eq(fiscalPeriods.id, id),
    });
  },
  async getFiscalPeriodsByBusiness(businessId: string) {
    return db.query.fiscalPeriods.findMany({
      where: eq(fiscalPeriods.businessId, businessId),
      orderBy: [desc(fiscalPeriods.created_at)],
    });
  },
  async updateFiscalPeriod(id: string, data: z.infer<typeof updateFiscalPeriodSchema>) {
    const validated = updateFiscalPeriodSchema.parse(data);
    const [period] = await db.update(fiscalPeriods)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(fiscalPeriods.id, id))
      .returning();
    return period;
  },
  async deleteFiscalPeriod(id: string) {
    await db.delete(fiscalPeriods).where(eq(fiscalPeriods.id, id));
    return true;
  },
};
