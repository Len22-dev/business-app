import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { reports } from '../schema/general';
import type { Report } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/userSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';

// Query parameter schema
const reportQuerySchema = z.object({
  businessId: uuidSchema,
  type: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'name', 'type']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ...paginationSchema.shape,
});

type ReportQueryParams = z.infer<typeof reportQuerySchema>;

export const reportQueries = {
  // Get report by ID
  async getById(reportId: string): Promise<Report | null> {
    try {
      const validatedId = uuidSchema.parse(reportId);
      const result = await db.query.reports.findFirst({
        where: eq(reports.id, validatedId),
      });
      return result as Report | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch report', error);
    }
  },

  // Get reports with filtering and pagination
  async getMany(queryParams: unknown): Promise<{
    reports: Report[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const { businessId, type, search, sortBy, sortOrder, limit, offset } = reportQuerySchema.parse(queryParams);
      const whereConditions = [eq(reports.businessId, businessId)];
      if (type) whereConditions.push(eq(reports.type, type));
      if (search) {
        whereConditions.push(ilike(reports.name, `%${search}%`));
      }
      // Get total count
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(reports)
        .where(and(...whereConditions));
      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      // Order by
      const orderByClause = sortOrder === 'desc'
        ? desc(reports[sortBy])
        : reports[sortBy];
      // Get paginated results
      const results = await db.query.reports.findMany({
        where: and(...whereConditions),
        orderBy: orderByClause,
        limit,
        offset,
      });
      return {
        reports: results as Report[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch reports', error);
    }
  },

  // Create report
  async create(reportData: Record<string, unknown>): Promise<Report> {
    try {
      // Add zod validation here if you have a schema
      // const validatedData = createReportSchema.parse(reportData);
      const [report] = await db
        .insert(reports)
        .values({
          ...reportData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return report;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create report', error);
    }
  },

  // Update report
  async update(reportId: string, reportData: Record<string, unknown>): Promise<Report> {
    try {
      const validatedId = uuidSchema.parse(reportId);
      // Add zod validation here if you have a schema
      // const validatedData = updateReportSchema.parse(reportData);
      const [report] = await db
        .update(reports)
        .set({
          ...reportData,
          updated_at: new Date(),
        })
        .where(eq(reports.id, validatedId))
        .returning();
      if (!report) throw new NotFoundError('Report not found');
      return report;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update report', error);
    }
  },

  // Soft delete report
  async delete(reportId: string): Promise<Report> {
    try {
      const validatedId = uuidSchema.parse(reportId);
      const [report] = await db
        .update(reports)
        .set({
          deleted_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(reports.id, validatedId))
        .returning();
      if (!report) throw new NotFoundError('Report not found');
      return report;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete report', error);
    }
  },
};

export { ValidationError, DatabaseError, NotFoundError };
export type { ReportQueryParams }; 