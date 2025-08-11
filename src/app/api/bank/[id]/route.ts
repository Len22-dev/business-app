import { NextRequest, NextResponse } from 'next/server';
import { bankQueries } from '@/lib/drizzle/queries/bank-queries';
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

    const bank = await bankQueries.getById(params.id);
    
    if (!bank) {
      return NextResponse.json({ error: 'Bank not found' }, { status: 404 });
    }

    return NextResponse.json(bank);
  } catch (error) {
    console.error('Error fetching bank:', error);
    return NextResponse.json({ error: 'Failed to fetch bank' }, { status: 500 });
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
    const bank = await bankQueries.update(params.id, data);
    return NextResponse.json(bank);
  } catch (error) {
    console.error('Error updating bank:', error);
    return NextResponse.json({ error: 'Failed to update bank' }, { status: 500 });
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

    const bank = await bankQueries.delete(params.id);
    return NextResponse.json(bank);
  } catch (error) {
    console.error('Error deleting bank:', error);
    return NextResponse.json({ error: 'Failed to delete bank' }, { status: 500 });
  }
}
