import { NextRequest, NextResponse } from 'next/server';
import { transactionQueries } from '@/lib/drizzle/queries/transaction-queries';
import { QueryParams } from '@/types';
 import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest) {
  try {
     await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const queryParams: QueryParams = {};
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    // Convert limit/offset to numbers if present
    if (queryParams.limit) queryParams.limit = Number(queryParams.limit);
    if (queryParams.offset) queryParams.offset = Number(queryParams.offset);

    const result = await transactionQueries.getMany(queryParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
     await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    
    // Extract transactionData from the request body
    const { transactionData } = data;
    
    if (!transactionData) {
      return NextResponse.json({ error: 'transactionData is required' }, { status: 400 });
    }
    
    const transaction = await transactionQueries.create(transactionData);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

