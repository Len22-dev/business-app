import { z } from "zod";

export const workFlowTypeEnum = z.enum(['approval', 'review', 'notification']);
export const workFlowStepTypeEnum = z.enum(['approval', 'review', 'notification']);

export const workFlowSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Workflow name is required" }),
  description: z.string().optional(),
  type: workFlowTypeEnum,
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createWorkFlowSchema = workFlowSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateWorkFlowSchema = createWorkFlowSchema.partial();

export const workFlowStepSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  workFlowId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Step name is required" }),
  description: z.string().optional(),
  stepNumber: z.number().int().min(1, { message: "Step number must be positive" }),
  stepType: workFlowStepTypeEnum,
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createWorkFlowStepSchema = workFlowStepSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateWorkFlowStepSchema = createWorkFlowStepSchema.partial();

export const approvalSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  recordType: z.string().max(50, { message: "Record type too long" }),
  recordId: z.string().uuid({ message: "Invalid UUID format" }),
  requestBy: z.string().uuid({ message: "Invalid UUID format" }),
  approvedBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  requestedAt: z.date().optional(),
  processedAt: z.date().optional(),
  comments: z.string().optional(),
  approverComments: z.string().optional(),
});

export const createApprovalSchema = approvalSchema.omit({
  id: true,
  requestedAt: true,
  processedAt: true,
});

export const updateApprovalSchema = createApprovalSchema.partial();