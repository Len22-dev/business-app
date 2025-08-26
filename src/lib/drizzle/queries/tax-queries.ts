import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { taxRates } from '../schema/tax-schema';
import { z } from 'zod';
import { createTaxRateSchema } from '@/lib/zod/taxSchema';

// const createTaxRateSchema = z.object({
  // businessId: z.string().uuid(),
  // name: z.string().min(1),
  // rate: z.number().min(0),
  // type: z.string().min(1),
  // isDefault: z.boolean().optional(),
  // isActive: z.boolean().optional(),
// });

const updateTaxRateSchema = createTaxRateSchema.partial();

export const taxQueries = {
  async createTaxRate(data: z.infer<typeof createTaxRateSchema>) {
    const validated = createTaxRateSchema.parse(data);
    const [taxRate] = await db.insert(taxRates).values({
      ...validated,
      isDefault: validated.isDefault ?? false,
      isActive: validated.isActive ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return taxRate;
  },
  async getTaxRateById(id: string) {
    return db.query.taxRates.findFirst({
      where: eq(taxRates.id, id),
    });
  },
  async getTaxRatesByBusiness(businessId: string) {
    return db.query.taxRates.findMany({
      where: eq(taxRates.businessId, businessId),
      orderBy: [desc(taxRates.created_at)],
    });
  },
  async updateTaxRate(id: string, data: z.infer<typeof updateTaxRateSchema>) {
    const validated = updateTaxRateSchema.parse(data);
    const [taxRate] = await db.update(taxRates)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(taxRates.id, id))
      .returning();
    return taxRate;
  },
  async deleteTaxRate(id: string) {
    await db.delete(taxRates).where(eq(taxRates.id, id));
    return true;
  },
};
