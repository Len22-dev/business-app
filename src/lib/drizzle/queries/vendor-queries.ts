import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { vendors } from '../schema/vendor-schema';
import { z } from 'zod';

const createVendorSchema = z.object({
  businessId: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  taxId: z.string().optional(),
  address: z.any().optional(),
  paymentTerms: z.number().int().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateVendorSchema = createVendorSchema.partial();

export const vendorQueries = {
  async createVendor(data: z.infer<typeof createVendorSchema>) {
    const validated = createVendorSchema.parse(data);
    const [vendor] = await db.insert(vendors).values({
      ...validated,
      isActive: validated.isActive ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return vendor;
  },
  async getVendorById(id: string) {
    return db.query.vendors.findFirst({
      where: eq(vendors.id, id),
    });
  },
  async getVendorsByBusiness(businessId: string) {
    return db.query.vendors.findMany({
      where: eq(vendors.businessId, businessId),
      orderBy: [desc(vendors.created_at)],
    });
  },
  async updateVendor(id: string, data: z.infer<typeof updateVendorSchema>) {
    const validated = updateVendorSchema.parse(data);
    const [vendor] = await db.update(vendors)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return vendor;
  },
  async deleteVendor(id: string) {
    await db.delete(vendors).where(eq(vendors.id, id));
    return true;
  },
};
