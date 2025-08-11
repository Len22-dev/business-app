import { pgTable, text, uuid, timestamp, boolean, integer, index, pgEnum, varchar, jsonb } from "drizzle-orm/pg-core";
import { businesses, locations } from "./businesses-schema";
import { users } from "./users-schema";
import { relations } from "drizzle-orm";
import { sales } from "./sales-schema";
import { purchases } from "./purchase-schema";
import { expenses } from "./expenses-schema";
import { payments } from "./payment-schema";
import { projects } from "./projects-schemas";

 const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'part_payment', 'failed', 'refunded']);
 export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'bank_transfer', 'card', 'cheque', 'mobile_money']);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late', 'early_out', 'holiday']);

// --- Employee Management -- //
export const employees = pgTable('employees', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    locationId: uuid('location_id'),
    managerId: uuid('manager_id'),
    position: text('position'),
    department: text('department'),
    salary: integer('salary').default(0),
    payrollType: varchar('payroll_type', { length: 20 }).default('monthly'),
    hireDate: timestamp('hire_date'),
    bankName: varchar('bank_name', { length: 100 }),
    accountNumber: varchar('account_number', { length: 20 }),
    accountName: varchar('account_name', { length: 255 }),
    emergencyContact: jsonb('emergency_contact'),
    bvn: varchar('bvn', { length: 11 }), // Bank Verification Number
    nin: varchar('nin', { length: 11 }), // National Identification Number
    pensionFundAdmin: varchar('pension_fund_admin', { length: 255 }),
    pensionPin: varchar('pension_pin', { length: 20 }),
    nsitfNumber: varchar('nsitf_number', { length: 50 }), // NSITF registration
    itfNumber: varchar('itf_number', { length: 50 }), // ITF registration
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    businessEmployeeIdx: index('employees_business_idx').on(table.businessId),
    userIdIdx: index('employees_user_idx').on(table.userId),
    positionIdx: index('employees_position_idx').on(table.position),
  }));
  
  // --- Payroll Management -- //
  export const payroll = pgTable('payroll', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
    locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
    amount: integer('amount').notNull().default(0),
    periodStart: timestamp('period_start').notNull(),
    periodEnd: timestamp('period_end').notNull(),
    basicSalary: integer('basic_salary').default(0).notNull(),
    allowances: integer('allowances').default(0),
    overtimePay: integer('overtime_pay').default(0),
    grossPay: integer('gross_pay').default(0).notNull(),
    taxDeduction: integer('tax_deduction').default(0),
    pensionDeduction: integer('pension_deduction').default(0),
    otherDeductions: integer('other_deductions').default(0),
    totalDeductions: integer('total_deductions').default(0),
    netPay: integer('net_pay').default(0).notNull(),
    paymentDate: timestamp('payment_date').defaultNow(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    paymentStatus: paymentStatusEnum('payment_status').notNull(),
    notes: text('notes'),
    ...timestamps,
  }, (table) => ({
    businessPayrollIdx: index('payroll_business_idx').on(table.businessId),
    employeePayrollIdx: index('payroll_employee_idx').on(table.employeeId),
  }));
  
  // --- Attendance Management -- //
  export const attendance = pgTable('attendance', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
    locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
    date: timestamp('date').defaultNow(),
    attendanceStatus: attendanceStatusEnum('attendance_status').notNull(),
    notes: text('notes'),
    ...timestamps,
  }, (table) => ({
    businessAttendanceIdx: index('attendance_business_idx').on(table.businessId),
    employeeAttendanceIdx: index('attendance_employee_idx').on(table.employeeId),
  }));

  export const timeEntries = pgTable('time_entries', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    employeeId: uuid('employee_id').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
    attendanceId: uuid('attendance_id').references(() => attendance.id, { onDelete: 'cascade' }).notNull(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }),
    entryDate: timestamp('entry_date').defaultNow(),
    startTime: timestamp('start_time').defaultNow(),
    endTime: timestamp('end_time'),
    breakStart: timestamp('break_start'),
    breakEnd: timestamp('break_end'),
    breakDuration: integer('break_duration').notNull().default(0),
    overtimeHours: integer('overtime_hours').default(0),
    hoursWorked: integer('hours_worked').notNull().default(0),
    notes: text('notes'),
    ...timestamps,
  }, (table) => ({
    businessTimeEntryIdx: index('time_entries_business_idx').on(table.businessId),
    employeeTimeEntryIdx: index('time_entries_employee_idx').on(table.employeeId),
  }));
  

  
export const employeesRelations = relations(employees, ({ one, many }) => ({
  business: one(businesses, {
    fields: [employees.businessId],
    references: [businesses.id],
  }),
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  locations: one(locations, {
    fields: [employees.locationId],
    references: [locations.id],
    relationName: 'employee_location',
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
    relationName: 'employee_manager',
  }),
  subordinates: many(employees, {
    relationName: 'employee_manager',
  }),
   createdSales: many(sales, {
    relationName: 'sales_created_by',
  }),
  createdPurchase: many(purchases, {
    relationName: 'purchase_created_by',
  }),
  createdExpenses: many(expenses, {
    relationName: 'expense_employee',
  }),
  approvedExpenses: many(expenses, {
    relationName: 'expense_approved_by',
  }),
  createdPayments: many(payments, {
    relationName: 'payment_created_by',
  }),
  approvedPayments: many(payments, {
    relationName: 'payment_approved_by',
  }),
  payroll: many(payroll),
  attendance: many(attendance),
}));


export const payrollRelations = relations(payroll, ({ one }) => ({
  business: one(businesses, {
    fields: [payroll.businessId],
    references: [businesses.id],
  }),
  employee: one(employees, {
    fields: [payroll.employeeId],
    references: [employees.id],
  }),
  location: one(locations, {
    fields: [payroll.locationId],
    references: [locations.id],
  })
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  business: one(businesses, {
    fields: [attendance.businessId],
    references: [businesses.id],
  }),
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
  location: one(locations, {
    fields: [attendance.locationId],
    references: [locations.id],
  })
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  business: one(businesses, {
    fields: [timeEntries.businessId],
    references: [businesses.id],
  }),
  employee: one(employees, {
    fields: [timeEntries.employeeId],
    references: [employees.id],
  }),
  attendance: one(attendance, {
    fields: [timeEntries.attendanceId],
    references: [attendance.id],
  }),
  projects: one(projects, {
    fields: [timeEntries.projectId],
    references: [projects.id],
  }),
  locations: one(locations, {
    fields: [timeEntries.locationId],
    references: [locations.id],
  })
}));
 