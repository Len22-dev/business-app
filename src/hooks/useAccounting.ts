import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Account,JournalEntry,LedgerEntry } from '@/lib/drizzle/types';

// Fetch Accounts
export function useAccounts(businessId: string) {
  return useQuery({
    queryKey: ['accounts', businessId],
    queryFn: async () => {
      const res = await fetch(`/api/accounting?type=accounts&businessId=${businessId}`);
      if (!res.ok) throw new Error('Failed to fetch accounts');
      return res.json();
    },
    enabled: !!businessId,
  });
}

// Fetch Journal Entries (paginated)
export function useJournalEntries(businessId: string, page = 1, pageSize = 20, order: 'asc' | 'desc' = 'desc') {
  return useQuery({
    queryKey: ['journalEntries', businessId, page, pageSize, order],
    queryFn: async () => {
      const res = await fetch(`/api/accounting?type=journal&businessId=${businessId}&page=${page}&pageSize=${pageSize}&order=${order}`);
      if (!res.ok) throw new Error('Failed to fetch journal entries');
      return res.json();
    },
    enabled: !!businessId,
  });
}

// Fetch Ledger Entries (paginated, by business or account)
export function useLedgerEntries(businessId: string, accountId?: string, page = 1, pageSize = 20, order: 'asc' | 'desc' = 'desc') {
  const url = accountId
    ? `/api/accounting?type=ledger&businessId=${businessId}&accountId=${accountId}&page=${page}&pageSize=${pageSize}&order=${order}`
    : `/api/accounting?type=ledger&businessId=${businessId}&page=${page}&pageSize=${pageSize}&order=${order}`;
  return useQuery({
    queryKey: ['ledgerEntries', businessId, accountId, page, pageSize, order],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch ledger entries');
      return res.json();
    },
    enabled: !!businessId,
  });
}

// Mutations
export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Account) => {
      const res = await fetch('/api/accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'account', data }),
      });
      if (!res.ok) throw new Error('Failed to create account');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ accountId, data }: { accountId: string; data: Account }) => {
      const res = await fetch('/api/accounting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'account', accountId, data }),
      });
      if (!res.ok) throw new Error('Failed to update account');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (accountId: string) => {
      const res = await fetch(`/api/accounting?type=account&id=${accountId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete account');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: JournalEntry) => {
      const res = await fetch('/api/accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'journal', data }),
      });
      if (!res.ok) throw new Error('Failed to create journal entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ journalEntryId, data }: { journalEntryId: string; data: JournalEntry }) => {
      const res = await fetch('/api/accounting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'journal', journalEntryId, data }),
      });
      if (!res.ok) throw new Error('Failed to update journal entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (journalEntryId: string) => {
      const res = await fetch(`/api/accounting?type=journal&id=${journalEntryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete journal entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });
}

export function useCreateLedgerEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: LedgerEntry) => {
      const res = await fetch('/api/accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ledger', data }),
      });
      if (!res.ok) throw new Error('Failed to create ledger entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledgerEntries'] });
    },
  });
}

export function useDeleteLedgerEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ledgerEntryId: string) => {
      const res = await fetch(`/api/accounting?type=ledger&id=${ledgerEntryId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete ledger entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledgerEntries'] });
    },
  });
} 