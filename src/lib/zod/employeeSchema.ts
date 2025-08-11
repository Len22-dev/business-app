import { z } from "zod";

export const paymentStatusEnum = z.enum(['pending', 'paid', 'part_payment', 'failed', 'refunded']);
export const paymentMethodEnum = z.enum(['cash', 'bank_transfer', 'card', 'cheque', 'mobile_money']);
export const attendanceStatusEnum = z.enum(['present', 'absent', 'late', 'early_out', 'holiday']);

export const employeeSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  userId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  managerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  salary: z.number().int().min(0).default(0),
  payrollType: z.string().max(20).default('monthly'),
  hireDate: z.date().optional(),
  bankName: z.string().max(100).optional(),
  accountNumber: z.string().max(20).optional(),
  accountName: z.string().max(255).optional(),
  emergencyContact: z.record(z.any()).optional(),
  bvn: z.string().length(11, { message: "BVN must be 11 characters" }).optional(),
  nin: z.string().length(11, { message: "NIN must be 11 characters" }).optional(),
  pensionFundAdmin: z.string().max(255).optional(),
  pensionPin: z.string().max(20).optional(),
  nsitfNumber: z.string().max(50).optional(),
  itfNumber: z.string().max(50).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createEmployeeSchema = employeeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const payrollSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  employeeId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }),
  amount: z.number().int().min(0),
  periodStart: z.date(),
  periodEnd: z.date(),
  basicSalary: z.number().int().min(0).default(0),
  allowances: z.number().int().min(0).default(0),
  overtimePay: z.number().int().min(0).default(0),
  grossPay: z.number().int().min(0).default(0),
  taxDeduction: z.number().int().min(0).default(0),
  pensionDeduction: z.number().int().min(0).default(0),
  otherDeductions: z.number().int().min(0).default(0),
  totalDeductions: z.number().int().min(0).default(0),
  netPay: z.number().int().min(0).default(0),
  paymentDate: z.date().optional(),
  paymentMethod: paymentMethodEnum,
  paymentStatus: paymentStatusEnum,
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createPayrollSchema = payrollSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updatePayrollSchema = createPayrollSchema.partial();

export const attendanceSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  employeeId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }),
  date: z.date().optional(),
  attendanceStatus: attendanceStatusEnum,
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createAttendanceSchema = attendanceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateAttendanceSchema = createAttendanceSchema.partial();

export const timeEntrySchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  employeeId: z.string().uuid({ message: "Invalid UUID format" }),
  attendanceId: z.string().uuid({ message: "Invalid UUID format" }),
  projectId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  locationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  entryDate: z.date().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  breakStart: z.date().optional(),
  breakEnd: z.date().optional(),
  breakDuration: z.number().int().min(0).default(0),
  overtimeHours: z.number().int().min(0).default(0),
  hoursWorked: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createTimeEntrySchema = timeEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateTimeEntrySchema = createTimeEntrySchema.partial();