import { db } from '../drizzle';
import { accounts, journalEntries, ledgerEntries } from '../schema/accounts-schema';
import { eq, desc, asc } from 'drizzle-orm';
import { z } from 'zod';

// Zod Schemas for validation
export const accountIdSchema = z.string().uuid();
export const businessIdSchema = z.string().uuid();
export const accountTypeSchema = z.enum([
  'asset', 'liability', 'equity', 'income', 'expense', 'accounts_receivable', 'accounts_payable', 'bank', 'cash', 'other',
]);

export const createAccountSchema = z.object({
  businessId: businessIdSchema,
  parentId: z.string().uuid().optional(),
  code: z.string().min(1).max(20),
  name: z.string().min(1),
  type: accountTypeSchema,
  description: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial();

export const createJournalEntrySchema = z.object({
  businessId: businessIdSchema,
  date: z.date().optional(),
  memo: z.string().optional(),
  reference: z.string().optional(),
  createdBy: z.string().uuid().optional(),
});

export const createLedgerEntrySchema = z.object({
  journalEntryId: z.string().uuid(),
  accountId: z.string().uuid(),
  businessId: businessIdSchema,
  debit: z.number().int().min(0),
  credit: z.number().int().min(0),
  description: z.string().optional(),
  relatedCustomerId: z.string().uuid().optional(),
  relatedVendorId: z.string().uuid().optional(),
  relatedInvoiceId: z.string().uuid().optional(),
  relatedExpenseId: z.string().uuid().optional(),
});

export const accountingQueries = {
  // ACCOUNTS (COA)
  async getAccountsByBusiness(businessId: string) {
    businessIdSchema.parse(businessId);
    return db.select().from(accounts).where(eq(accounts.businessId, businessId)).orderBy(accounts.code);
  },
  async getAccountById(accountId: string) {
    accountIdSchema.parse(accountId);
    return db.query.accounts.findFirst({ where: eq(accounts.id, accountId) });
  },
  async createAccount(data: z.infer<typeof createAccountSchema>) {
    createAccountSchema.parse(data);
    return db.insert(accounts).values(data).returning();
  },
  async updateAccount(accountId: string, data: z.infer<typeof updateAccountSchema>) {
    accountIdSchema.parse(accountId);
    updateAccountSchema.parse(data);
    return db.update(accounts).set(data).where(eq(accounts.id, accountId)).returning();
  },
  async deleteAccount(accountId: string) {
    accountIdSchema.parse(accountId);
    return db.delete(accounts).where(eq(accounts.id, accountId)).returning();
  },

  // JOURNAL ENTRIES
  async getJournalEntriesByBusiness(businessId: string, { page = 1, pageSize = 20, order = 'desc' } = {}) {
    businessIdSchema.parse(businessId);
    const offset = (page - 1) * pageSize;
    return db.select().from(journalEntries)
      .where(eq(journalEntries.businessId, businessId))
      .orderBy(order === 'desc' ? desc(journalEntries.date) : asc(journalEntries.date))
      .limit(pageSize).offset(offset);
  },
  async getJournalEntryById(journalEntryId: string) {
    return db.query.journalEntries.findFirst({ where: eq(journalEntries.id, journalEntryId) });
  },
  async createJournalEntry(data: z.infer<typeof createJournalEntrySchema>) {
    createJournalEntrySchema.parse(data);
    return db.insert(journalEntries).values(data).returning();
  },
  async updateJournalEntry(journalEntryId: string, data: Partial<z.infer<typeof createJournalEntrySchema>>) {
    return db.update(journalEntries).set(data).where(eq(journalEntries.id, journalEntryId)).returning();
  },
  async deleteJournalEntry(journalEntryId: string) {
    return db.delete(journalEntries).where(eq(journalEntries.id, journalEntryId)).returning();
  },

  // LEDGER ENTRIES
  async getLedgerEntriesByBusiness(businessId: string, { page = 1, pageSize = 20, order = 'desc' } = {}) {
    businessIdSchema.parse(businessId);
    const offset = (page - 1) * pageSize;
    return db.select().from(ledgerEntries)
      .where(eq(ledgerEntries.businessId, businessId))
      .orderBy(order === 'desc' ? desc(ledgerEntries.created_at) : asc(ledgerEntries.created_at))
      .limit(pageSize).offset(offset);
  },
  async getLedgerEntriesByAccount(accountId: string, { page = 1, pageSize = 20, order = 'desc' } = {}) {
    accountIdSchema.parse(accountId);
    const offset = (page - 1) * pageSize;
    return db.select().from(ledgerEntries)
      .where(eq(ledgerEntries.accountId, accountId))
      .orderBy(order === 'desc' ? desc(ledgerEntries.created_at) : asc(ledgerEntries.created_at))
      .limit(pageSize).offset(offset);
  },
  async createLedgerEntry(data: z.infer<typeof createLedgerEntrySchema>) {
    createLedgerEntrySchema.parse(data);
    return db.insert(ledgerEntries).values(data).returning();
  },
  async deleteLedgerEntry(ledgerEntryId: string) {
    return db.delete(ledgerEntries).where(eq(ledgerEntries.id, ledgerEntryId)).returning();
  },
}; 