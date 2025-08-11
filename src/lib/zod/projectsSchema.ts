import { z } from "zod";

export const projectSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  customerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  projectNumber: z.string().max(100, { message: "Project number too long" }),
  projectName: z.string().max(255, { message: "Project name too long" }).min(1, { message: "Project name is required" }),
  description: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  estimatedHours: z.number().int().min(0).default(0),
  actualHours: z.number().int().min(0).default(0),
  hourlyRate: z.number().int().min(0).default(0),
  fixedPrice: z.number().int().min(0).default(0),
  billingType: z.enum(['hourly', 'fixed', 'milestone']).default('hourly'),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
  projectManagerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  totalExpenses: z.number().int().min(0).default(0),
  totalRevenue: z.number().int().min(0).default(0),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectTaskSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  projectId: z.string().uuid({ message: "Invalid UUID format" }),
  taskName: z.string().max(255, { message: "Task name too long" }).min(1, { message: "Task name is required" }),
  description: z.string().optional(),
  assignedTo: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  estimatedHours: z.number().int().min(0).default(0),
  actualHours: z.number().int().min(0).default(0),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  completedAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export const createProjectTaskSchema = projectTaskSchema.omit({
  id: true,
  createdAt: true,
});

export const updateProjectTaskSchema = createProjectTaskSchema.partial();