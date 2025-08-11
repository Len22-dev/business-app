import { pgTable, uuid, text, boolean, index, integer, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { businesses } from "./businesses-schema";
import { users } from "./users-schema";

export const workFlowTypeEnum = pgEnum('work_flow_type', ['approval', 'review', 'notification']);
export const workFlowStepTypeEnum = pgEnum('work_flow_step_type', ['approval', 'review', 'notification']);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// --- Work Flows ---
export const workFlows = pgTable('work_flows', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    type: workFlowTypeEnum('type').notNull(),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    businessWorkFlowIdx: index('work_flows_business_idx').on(table.businessId),
  }));
  
  // --- Work Flow Steps ---
  export const workFlowSteps = pgTable('work_flow_steps', {
    id: uuid('id').primaryKey().defaultRandom(),
    workFlowId: uuid('work_flow_id').references(() => workFlows.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    stepNumber: integer('step_number').notNull(),
    stepType: workFlowStepTypeEnum('step_type').notNull(),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    workFlowStepIdx: index('work_flow_steps_work_flow_idx').on(table.workFlowId),
  }));

  // Approval workflow
export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  recordType: varchar('record_type', { length: 50 }).notNull(), // expense, purchase, sale, etc.
  recordId: uuid('record_id').notNull(),
  requestBy: uuid('request_by').notNull().references(() => users.id),
  approvedBy: uuid('approved_by').references(() => users.id),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  requestedAt: timestamp('requested_at').defaultNow(),
  processedAt: timestamp('processed_at'),
  comments: text('comments'),
  approverComments: text('approver_comments'),
});

export const workFlowsRelations = relations(workFlows, ({ one, many }) => ({
  business: one(businesses, {
    fields: [workFlows.businessId],
    references: [businesses.id],
  }),
  workFlowSteps: many(workFlowSteps),
}));

export const workFlowStepsRelations = relations(workFlowSteps, ({ one }) => ({
  workFlow: one(workFlows, {
    fields: [workFlowSteps.workFlowId],
    references: [workFlows.id],
  }),
}));
  
export const approvalsRelations = relations(approvals, ({ one }) => ({
  tenant: one(businesses, {
    fields: [approvals.businessId],
    references: [businesses.id],
  }),
  requesterUser: one(users, {
    fields: [approvals.requestBy],
    references: [users.id],
  }),
  approverUser: one(users, {
    fields: [approvals.approvedBy],
    references: [users.id],
  }),
}));