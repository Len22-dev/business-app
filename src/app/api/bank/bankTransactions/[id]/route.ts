import { NextRequest, NextResponse } from 'next/server';
import { bankTransactionQueries } from '@/lib/drizzle/queries/bankTransaction-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }

    const bankTransaction = await bankTransactionQueries.getById(params.id);
    
    if (!bankTransaction) {
      return NextResponse.json({ error: 'Bank transaction not found' }, { status: 404 });
    }

    return NextResponse.json(bankTransaction);
  } catch (error) {
    console.error('Error fetching bank transaction:', error);
    return NextResponse.json({ error: 'Failed to fetch bank transaction' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }

    const data = await request.json();
    const bankTransaction = await bankTransactionQueries.update(params.id, data);
    return NextResponse.json(bankTransaction);
  } catch (error) {
    console.error('Error updating bank transaction:', error);
    return NextResponse.json({ error: 'Failed to update bank transaction' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }

    const bankTransaction = await bankTransactionQueries.delete(params.id);
    return NextResponse.json(bankTransaction);
  } catch (error) {
    console.error('Error deleting bank transaction:', error);
    return NextResponse.json({ error: 'Failed to delete bank transaction' }, { status: 500 });
  }
}
