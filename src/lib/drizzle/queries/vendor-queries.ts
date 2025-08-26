import { eq, desc } from 'drizzle-orm';
import { db } from '../drizzle';
import { vendors, vendorContacts } from '../schema/vendor-schema';
import { z } from 'zod';
import { 
  createVendorSchema, 
  updateVendorSchema, 
  vendorWithContactSchema,
  createVendorContactSchema 
} from '@/lib/zod/vendorSchema';

export const vendorQueries = {
  // Create vendor with optional contact person
  async createVendorWithContact(data: z.infer<typeof vendorWithContactSchema>) {
    const validated = vendorWithContactSchema.parse(data);
    
    return await db.transaction(async (tx) => {
      // Create the vendor
      const vendorData = {
        businessId: validated.businessId,
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        company: validated.company,
        taxId: validated.taxId,
        address: validated.address,
        paymentTerms: validated.paymentTerms,
        notes: validated.notes,
        isActive: true,
      };

      const [vendor] = await tx.insert(vendors).values({
        ...vendorData,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();

      // Create contact person if contact information is provided
      let contact = null;
      if (validated.contactPersonName && validated.contactPersonName.trim()) {
        const contactData = {
          businessId: validated.businessId,
          vendorId: vendor.id,
          name: validated.contactPersonName,
          position: validated.position,
          phone: validated.contactPersonPhone,
          email: validated.contactPersonEmail,
          isPrimary: validated.isPrimary,
        };

        [contact] = await tx.insert(vendorContacts).values({
          ...contactData,
          createdAt: new Date(),
        }).returning();
      }

      return {
        vendor,
        contact,
      };
    });
  },

  // Create vendor only (original method)
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

  // Get vendor by ID with contacts
  async getVendorById(id: string) {
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, id),
      with: {
        contacts: {
          orderBy: [desc(vendorContacts.isPrimary), desc(vendorContacts.createdAt)],
        },
      },
    });
    return vendor;
  },

  // Get vendor by ID without contacts
  async getVendorByIdOnly(id: string) {
    return db.query.vendors.findFirst({
      where: eq(vendors.id, id),
    });
  },

  // Get vendors by business with contacts
  async getVendorsByBusiness(businessId: string) {
    return db.query.vendors.findMany({
      where: eq(vendors.businessId, businessId),
      orderBy: [desc(vendors.created_at)],
      with: {
        contacts: {
          orderBy: [desc(vendorContacts.isPrimary), desc(vendorContacts.createdAt)],
        },
      },
    });
  },

  // Get vendors by business without contacts
  async getVendorsByBusinessOnly(businessId: string) {
    return db.query.vendors.findMany({
      where: eq(vendors.businessId, businessId),
      orderBy: [desc(vendors.created_at)],
    });
  },

  // Update vendor
  async updateVendor(id: string, data: z.infer<typeof updateVendorSchema>) {
    const validated = updateVendorSchema.parse(data);
    const [vendor] = await db.update(vendors)
      .set({ ...validated, updated_at: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return vendor;
  },

  // Delete vendor (will cascade delete contacts if foreign key is set up)
  async deleteVendor(id: string) {
    await db.delete(vendors).where(eq(vendors.id, id));
    return true;
  },

  // Soft delete vendor (mark as inactive)
  async deactivateVendor(id: string) {
    const [vendor] = await db.update(vendors)
      .set({ 
        isActive: false, 
        updated_at: new Date(),
        deleted_at: new Date() 
      })
      .where(eq(vendors.id, id))
      .returning();
    return vendor;
  },
};

// Contact-specific queries
export const vendorContactQueries = {
  // Create contact for existing vendor
  async createContact(data: z.infer<typeof createVendorContactSchema>) {
    const validated = createVendorContactSchema.parse(data);
    
    // If this contact is being set as primary, update other contacts for this vendor
    if (validated.isPrimary) {
      await db.update(vendorContacts)
        .set({ isPrimary: false })
        .where(eq(vendorContacts.vendorId, validated.vendorId));
    }

    const [contact] = await db.insert(vendorContacts).values({
      ...validated,
      createdAt: new Date(),
    }).returning();
    
    return contact;
  },

  // Get contacts by vendor
  async getContactsByVendor(vendorId: string) {
    return db.query.vendorContacts.findMany({
      where: eq(vendorContacts.vendorId, vendorId),
      orderBy: [desc(vendorContacts.isPrimary), desc(vendorContacts.createdAt)],
    });
  },

  // Get primary contact for vendor
  async getPrimaryContact(vendorId: string) {
    return db.query.vendorContacts.findFirst({
      where: eq(vendorContacts.vendorId, vendorId),
      orderBy: [desc(vendorContacts.isPrimary)],
    });
  },

  // Update contact
  async updateContact(id: string, data: Partial<z.infer<typeof createVendorContactSchema>>) {
    const [contact] = await db.update(vendorContacts)
      .set(data)
      .where(eq(vendorContacts.id, id))
      .returning();
    return contact;
  },

  // Delete contact
  async deleteContact(id: string) {
    await db.delete(vendorContacts).where(eq(vendorContacts.id, id));
    return true;
  },

  // Set primary contact (unsets others)
  async setPrimaryContact(contactId: string, vendorId: string) {
    return await db.transaction(async (tx) => {
      // Remove primary status from all contacts for this vendor
      await tx.update(vendorContacts)
        .set({ isPrimary: false })
        .where(eq(vendorContacts.vendorId, vendorId));

      // Set the specified contact as primary
      const [contact] = await tx.update(vendorContacts)
        .set({ isPrimary: true })
        .where(eq(vendorContacts.id, contactId))
        .returning();

      return contact;
    });
  },
};