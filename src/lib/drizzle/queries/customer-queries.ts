import { eq, and,  desc, gte,   } from 'drizzle-orm';
import { db } from "../drizzle";
import { customers } from '../schema';
import { createCustomerSchema } from '@/lib/zod/customerSchema';
import { Customer } from '@/lib/types';
import { DatabaseError, ValidationError } from './business-queries';
import { z } from 'zod';

// CUSTOMER QUERIES
export const customerQueries = {
  async getCustomers(businessId: string) {
    const customers = await db.query.customers.findMany({
        where: (customers, { eq }) => eq(customers.businessId, businessId),
        orderBy: (customers, { desc }) => desc(customers.name),
        columns:{
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            customerType: true,
            outstandingBalance: true,
            billingAddress: true,
            shippingAddress: true,
            city: true,
            state: true,
            country: true,
            taxId: true,
            company: true,
            created_at: true,
            isActive: true,
        },
        with:{
        sales: {
            columns:{
                id: true,
                customerId: true,
                totalAmount: true,
                createdAt: true,
            },
        },
        invoices: {
            columns:{
                id: true,
                salesId: true,
                totalAmount: true,
                createdAt: true,
            }
        }
        
    },
    
        });
    return customers;
  },
  

  async getById(id: string, businessId: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, id), eq(customers.businessId, businessId)));
    
    return customer;
  },

  async create(customerData: Customer) {
    try {
      console.log('Customer data:', customerData);
      const validatedData = createCustomerSchema.parse(customerData);
      console.log('Validated data:',validatedData);
      const [customer] = await db
        .insert(customers)
        .values({
          ...validatedData, 
         created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      
      return customer as Customer;
    } catch (error) {
          if (error instanceof z.ZodError) {
            throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message[0]).join(', ')}`);
          }
          throw new DatabaseError('Failed to create product', error);
        }
      },
  

  async update(id: string, businessId: string, data: Partial<typeof customers.$inferInsert>) {
    const [customer] = await db
      .update(customers)
      .set({ ...data, updated_at: new Date() })
      .where(and(eq(customers.id, id), eq(customers.businessId, businessId)))
      .returning();
    
    return customer;
  },

  async delete(id: string, businessId: string) {
    await db
      .delete(customers)
      .where(and(eq(customers.id, id), eq(customers.businessId, businessId)));
  },

  async getWithOutstandingBalance(businessId: string) {
    return await db
      .select()
      .from(customers)
      .where(and(
        eq(customers.businessId, businessId),
        gte(customers.outstandingBalance, 0.01)
      ))
      .orderBy(desc(customers.outstandingBalance));
  }
};