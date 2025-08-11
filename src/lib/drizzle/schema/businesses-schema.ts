import { 
    pgTable, 
    text, 
    uuid, 
    varchar, 
    timestamp, 
    boolean,  
    integer, 
    jsonb,
    uniqueIndex
  } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { subscriptions } from "./subscriptions-schema";
import { categories, products } from "./products-schema";
import { inventory, stockMovements, } from "./inventory-schema";
import { customers } from "./customer-schema";
import { vendors } from "./vendor-schema";
import { sales } from "./sales-schema";
import { purchases } from "./purchase-schema";
import { invoices } from "./invoice-schema";
import { payments } from "./payment-schema";
import { banks } from "./banking-schema";
import { bankTransactions } from "./banking-schema";
import { transactions } from "./transactions-schema";
import { expenses } from "./expenses-schema";
import { accounts, journalEntries, ledgerEntries } from "./accounts-schema";
import { fiscalPeriods } from "./budgeting-schema";
import { attendance, employees, payroll } from "./employees-schema";
import { taxRates } from "./tax-schema";
import { settings } from "./settings-schema";
import { reports } from "./report-schema";
import { notifications } from "./notifications-schema";
import { auditLogs } from "./auditLogs-schema";
import { documents } from "./documents-schema";
import { exchangeRates } from "./currency-schema";
import { currencies } from "./currency-schema";
import { userRoleEnum, users } from "./users-schema";
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole} from "drizzle-orm/supabase";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}


export const businesses = pgTable('businesses', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(), // Unique slug for SEO
    shortName: varchar('short_name', { length: 50 }).notNull(), // Short name for display
    businessType: varchar('business_type', { length: 50 }).notNull(), // E.g. "restaurant", "retail store", etc.
    industry: varchar('industry', { length: 50 }).notNull(), // E.g. "food", "electronics", "services", etc.
    description: text('description'),
    email: text('email'),
    phone: varchar('phone', { length: 20 }),
    website: text('website'),
    logo: text('logo'),
    address: text('address'), // {street,}
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }).default('Nigeria'),
    taxId: varchar('tax_id', { length: 50 }),
    registrationNumber: varchar('registration_number', { length: 50 }),
    currency: varchar('currency', { length: 3 }).default('USD'),
    timezone: varchar('timezone', { length: 50 }).default('UTC'),
    settings: jsonb('settings'),
    fiscalYearStart: integer('fiscal_year_start').default(1), // Month (1-12)
    isActive: boolean('is_active').default(true),
    ...timestamps,
  });
  
  export const businessUsers = pgTable('business_users', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    role: userRoleEnum('role').notNull(),
    permissions: jsonb('permissions'), // Custom permissions object
    isActive: boolean('is_active').default(true),
    invitedAt: timestamp('invited_at'),
    joinedAt: timestamp('joined_at').defaultNow(),
    ...timestamps,
  }, (table) => ([
     uniqueIndex('business_users_business_user_idx').on(table.businessId, table.userId),
  ]));
  
  // Business locations/branches
export const locations = pgTable('locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  managerId: uuid('manager_id').references(() => employees.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});



// RLS Policies for Businesses Table
export const businessesSelectPolicy = pgPolicy("users can select businesses they belong to", {
  for: "select",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = businesses.id 
      AND bu.user_id = auth.uid() 
      AND bu.is_active = true
    )
  `,
}).link(businesses);

export const businessesInsertPolicy = pgPolicy("users can insert businesses", {
  for: "insert",
  to: authenticatedRole,
  using: sql`auth.uid() IS NOT NULL`,
}).link(businesses);

export const businessesUpdatePolicy = pgPolicy("users can update businesses they own or admin", {
  for: "update",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = businesses.id 
      AND bu.user_id = auth.uid() 
      AND bu.role IN ('owner', 'admin') 
      AND bu.is_active = true
    )
  `,
}).link(businesses);

export const businessesDeletePolicy = pgPolicy("only business owners can delete businesses", {
  for: "delete",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = businesses.id 
      AND bu.user_id = auth.uid() 
      AND bu.role = 'owner' 
      AND bu.is_active = true
    )
  `,
}).link(businesses);

// RLS Policies for Business Users Table
export const businessUsersSelectPolicy = pgPolicy("users can select business_users for their businesses", {
  for: "select",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = business_users.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.is_active = true
    )
  `,
}).link(businessUsers);

export const businessUsersInsertPolicy = pgPolicy("owners and admin can invite users", {
  for: "insert",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = business_users.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.role IN ('owner', 'admin') 
      AND bu.is_active = true
    )
  `,
}).link(businessUsers);

export const businessUsersUpdatePolicy = pgPolicy("owners and admins can update business users", {
  for: "update",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = business_users.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.role IN ('owner', 'admin') 
      AND bu.is_active = true
    )
    OR business_users.user_id = auth.uid() -- Users can update their own record
  `,
}).link(businessUsers);

export const businessUsersDeletePolicy = pgPolicy("owners and admin can delete users", {
  for: "delete",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = business_users.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.role IN ('owner', 'admin') 
      AND bu.is_active = true
    )
    OR business_users.user_id = auth.uid() -- Users can remove themselves
  `,
}).link(businessUsers);

// RLS Policies for Locations Table
export const locationsSelectPolicy = pgPolicy("users can select locations of their businesses", {
  for: "select",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = locations.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.is_active = true
    )
  `,
}).link(locations);

export const locationsInsertPolicy = pgPolicy("owners and admins can create locations", {
  for: "insert",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = locations.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.role IN ('owner', 'admin') 
      AND bu.is_active = true
    )
  `,
}).link(locations);

export const locationsUpdatePolicy = pgPolicy("owners, admins, and managers can update locations", {
  for: "update",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = locations.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.role IN ('owner', 'admin', 'manager') 
      AND bu.is_active = true
    )
    OR EXISTS (
      SELECT 1 FROM employees e
      WHERE e.id = locations.manager_id
      AND e.user_id = auth.uid()
    ) -- Location managers can update their own locations
  `,
}).link(locations);

export const locationsDeletePolicy = pgPolicy("only owners and admins can delete locations", {
  for: "delete",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = locations.business_id 
      AND bu.user_id = auth.uid() 
      AND bu.role IN ('owner', 'admin') 
      AND bu.is_active = true
    )
  `,
}).link(locations);

// Additional helper policies for common scenarios

// Policy to allow users to see businesses they've been invited to (but not yet joined)
export const businessesInvitedSelectPolicy = pgPolicy("users can see businesses they're invited to", {
  for: "select",
  to: authenticatedRole,
  using: sql`
    EXISTS (
      SELECT 1 FROM business_users bu 
      WHERE bu.business_id = businesses.id 
      AND bu.user_id = auth.uid() 
      AND bu.invited_at IS NOT NULL 
      AND bu.joined_at IS NULL
    )
  `,
}).link(businesses);

// Enable RLS on all tables
export const enableBusinessesRLS = sql`ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;`;
export const enableBusinessUsersRLS = sql`ALTER TABLE business_users ENABLE ROW LEVEL SECURITY;`;
export const enableLocationsRLS = sql`ALTER TABLE locations ENABLE ROW LEVEL SECURITY;`;



  export const businessesRelations = relations(businesses, ({ many, one }) => ({
    businessUsers: many(businessUsers),
    subscription: one(subscriptions),
    categories: many(categories),
    products: many(products),
    inventory: many(inventory),
    customers: many(customers),
    vendors: many(vendors),
    sales: many(sales),
    purchases: many(purchases),
    invoices: many(invoices),
    payments: many(payments),
    banks: many(banks),
    bankTransactions: many(bankTransactions),
    transactions: many(transactions),
    expenses: many(expenses),
    taxRates: many(taxRates),
    settings: many(settings),
    reports: many(reports),
    notifications: many(notifications),
    auditLogs: many(auditLogs),
    documents: many(documents),
    accounts: many(accounts),
    journalEntries: many(journalEntries),
    ledgerEntries: many(ledgerEntries),
    stockMovements: many(stockMovements),
    locations: many(locations),
    fiscalPeriods: many(fiscalPeriods),
    exchangeRates: many(exchangeRates),
    currencies: many(currencies),
    employees: many(employees),
    payroll: many(payroll),
    attendance: many(attendance),
  }));
  
  export const businessUsersRelations = relations(businessUsers, ({ one }) => ({
    business: one(businesses, {
      fields: [businessUsers.businessId],
      references: [businesses.id],
    }),
    user: one(users, {
      fields: [businessUsers.userId],
      references: [users.id],
    }),
  }));

  export const locationRelations = relations(locations, ({ one }) => ({
    business: one(businesses, {
      fields: [locations.businessId],
      references: [businesses.id],
    })
  }))