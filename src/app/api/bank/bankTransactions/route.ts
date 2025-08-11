import { NextRequest, NextResponse } from 'next/server';
import { bankTransactionQueries } from '@/lib/drizzle/queries/bankTransaction-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }

    // Build query parameters
    const queryParams: Record<string, string | number> = { businessId };
    
    // Add optional filters
    const bankId = searchParams.get('bankId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    
    if (bankId) queryParams.bankId = bankId;
    if (type) queryParams.type = type;
    if (status) queryParams.status = status;
    if (search) queryParams.search = search;
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;
    if (minAmount) queryParams.minAmount = Number(minAmount);
    if (maxAmount) queryParams.maxAmount = Number(maxAmount);
    
    // Add pagination
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    if (page) queryParams.page = Number(page);
    if (limit) queryParams.limit = Number(limit);
    
    // Add sorting
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    if (sortBy) queryParams.sortBy = sortBy;
    if (sortOrder) queryParams.sortOrder = sortOrder;

    const result = await bankTransactionQueries.getMany(queryParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching bank transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch bank transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const bankTransaction = await bankTransactionQueries.create(data);
    return NextResponse.json(bankTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating bank transaction:', error);
    return NextResponse.json({ error: 'Failed to create bank transaction' }, { status: 500 });
  }
}
