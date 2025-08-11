import { date, integer, pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { customers } from "./customer-schema";
import { businesses } from "./businesses-schema";
import { employees } from "./employees-schema";
import { relations } from "drizzle-orm";

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => customers.id),
  projectNumber: varchar('project_number', { length: 100 }).notNull(),
  projectName: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  estimatedHours: integer('estimated_hours').default(0),
  actualHours: integer('actual_hours').default(0),
  hourlyRate: integer('hourly_rate').default(0),
  fixedPrice: integer('fixed_price').default(0),
  billingType: varchar('billing_type', { length: 20 }).default('hourly'), // hourly, fixed, milestone
  status: varchar('status', { length: 20 }).default('planning'), // planning, active, completed, cancelled
  projectManagerId: uuid('project_manager_id').references(() => employees.id),
  totalExpenses: integer('total_expenses').default(0),
  totalRevenue: integer('total_revenue').default(0),
  createdBy: uuid('created_by').references(() => employees.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projectTasks = pgTable('project_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  taskName: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  assignedTo: uuid('assigned_to').references(() => employees.id),
  startDate: date('start_date'),
  dueDate: date('due_date'),
  estimatedHours: integer('estimated_hours').default(0),
  actualHours: integer('actual_hours').default(0),
  status: varchar('status', { length: 20 }).default('pending'), // pending, in_progress, completed
  priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high, urgent
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});  


export const projectRelations = relations(projects, ({ one }) => ({
    business: one (businesses,{
        fields: [projects.businessId],
        references: [businesses.id],
    }),
    
    customer: one (customers,{
        fields: [projects.customerId],
        references: [customers.id],
    }),
    employees: one (employees,{
        fields: [projects.projectManagerId],
        references: [employees.id],
    })
}));

export const projectTasksRelations = relations(projectTasks, ({ one }) => ({
    business: one (businesses,{
        fields: [projectTasks.businessId],
        references: [businesses.id],
    }),

    project: one (projects,{
        fields: [projectTasks.projectId],
        references: [projects.id],
    }),
    employees: one (employees,{
        fields: [projectTasks.assignedTo],
        references: [employees.id],
    }),
}))