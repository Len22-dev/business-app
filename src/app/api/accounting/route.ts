import { NextRequest, NextResponse } from 'next/server';
import { accountingQueries, createAccountSchema, createJournalEntrySchema, createLedgerEntrySchema } from '@/lib/drizzle/queries/accounting-queries';
import { z } from 'zod';

// Helper for pagination params
function getPaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
  return { page, pageSize, order };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const type = searchParams.get('type'); // 'accounts', 'journal', 'ledger'
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const pagination = getPaginationParams(request);
    if (type === 'accounts') {
      const data = await accountingQueries.getAccountsByBusiness(businessId);
      return NextResponse.json(data);
    } else if (type === 'journal') {
      const data = await accountingQueries.getJournalEntriesByBusiness(businessId, pagination);
      return NextResponse.json(data);
    } else if (type === 'ledger') {
      const accountId = searchParams.get('accountId');
      if (accountId) {
        const data = await accountingQueries.getLedgerEntriesByAccount(accountId, pagination);
        return NextResponse.json(data);
      } else {
        const data = await accountingQueries.getLedgerEntriesByBusiness(businessId, pagination);
        return NextResponse.json(data);
      }
    } else {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in GET /api/accounting:', error);
    return NextResponse.json({ error: 'Failed to fetch accounting data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.type === 'account') {
      const data = createAccountSchema.parse(body.data);
      const result = await accountingQueries.createAccount(data);
      return NextResponse.json(result, { status: 201 });
    } else if (body.type === 'journal') {
      const data = createJournalEntrySchema.parse(body.data);
      const result = await accountingQueries.createJournalEntry(data);
      return NextResponse.json(result, { status: 201 });
    } else if (body.type === 'ledger') {
      const data = createLedgerEntrySchema.parse(body.data);
      const result = await accountingQueries.createLedgerEntry(data);
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Invalid type for POST' }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error in POST /api/accounting:', error);
    return NextResponse.json({ error: 'Failed to create accounting record' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.type === 'account') {
      const { accountId, data } = body;
      const result = await accountingQueries.updateAccount(accountId, data);
      return NextResponse.json(result);
    } else if (body.type === 'journal') {
      const { journalEntryId, data } = body;
      const result = await accountingQueries.updateJournalEntry(journalEntryId, data);
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Invalid type for PUT' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/accounting:', error);
    return NextResponse.json({ error: 'Failed to update accounting record' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!type || !id) {
      return NextResponse.json({ error: 'type and id are required' }, { status: 400 });
    }
    let result;
    if (type === 'account') {
      result = await accountingQueries.deleteAccount(id);
    } else if (type === 'journal') {
      result = await accountingQueries.deleteJournalEntry(id);
    } else if (type === 'ledger') {
      result = await accountingQueries.deleteLedgerEntry(id);
    } else {
      return NextResponse.json({ error: 'Invalid type for DELETE' }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in DELETE /api/accounting:', error);
    return NextResponse.json({ error: 'Failed to delete accounting record' }, { status: 500 });
  }
} 