import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { documents } from '../schema';
import type { Document } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { createDocumentSchema } from '@/lib/zod/documentSchema';

const documentQuerySchema = z.object({
  businessId: uuidSchema,
  type: z.string().optional(),
  search: z.string().optional(),
  ...paginationSchema.shape,
});

type DocumentQueryParams = z.infer<typeof documentQuerySchema>;

export const documentQueries = {
  async getById(documentId: string): Promise<Document | null> {
    try {
      const validatedId = uuidSchema.parse(documentId);
      const result = await db.query.documents.findFirst({
        where: eq(documents.id, validatedId),
      });
      return result as Document | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch document', error);
    }
  },

  async getMany(queryParams: unknown): Promise<{
    documents: Document[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const { businessId, type, search, limit, offset } = documentQuerySchema.parse(queryParams);
      const whereConditions = [eq(documents.businessId, businessId)];
      if (type) whereConditions.push(eq(documents.referenceType, type));
      if (search) whereConditions.push(ilike(documents.fileName, `%${search}%`));
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(documents)
        .where(and(...whereConditions));
      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const results = await db.query.documents.findMany({
        where: and(...whereConditions),
        orderBy: desc(documents.created_at),
        limit,
        offset,
      });
      return {
        documents: results as Document[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch documents', error);
    }
  },

  async create(documentData: Record<string, unknown>): Promise<z.infer<typeof createDocumentSchema>> {
    try {
      // Add zod validation here if you have a schema
      const validatedData = createDocumentSchema.parse(documentData);
      const [document] = await db
        .insert(documents)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return document as z.infer<typeof createDocumentSchema>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create document', error);
    }
  },

  async update(documentId: string, documentData: Record<string, unknown>): Promise<Document> {
    try {
      const validatedId = uuidSchema.parse(documentId);
      const [document] = await db
        .update(documents)
        .set({
          ...documentData,
          updated_at: new Date(),
        })
        .where(eq(documents.id, validatedId))
        .returning();
      if (!document) throw new NotFoundError('Document not found');
      return document;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update document', error);
    }
  },

  async delete(documentId: string): Promise<Document> {
    try {
      const validatedId = uuidSchema.parse(documentId);
      const [document] = await db
        .update(documents)
        .set({
          deleted_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(documents.id, validatedId))
        .returning();
      if (!document) throw new NotFoundError('Document not found');
      return document;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete document', error);
    }
  },
};

export { ValidationError, DatabaseError, NotFoundError };
export type { DocumentQueryParams }; 