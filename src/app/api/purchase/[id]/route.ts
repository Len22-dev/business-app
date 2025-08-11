import { NextRequest, NextResponse } from 'next/server';
import { purchaseQueries } from '@/lib/drizzle/queries/purchase-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const purchase = await purchaseQueries.getById(params.id);
    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }
    return NextResponse.json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const updated = await purchaseQueries.update(params.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating purchase:', error);
    return NextResponse.json({ error: 'Failed to update purchase' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return PUT(request, ctx); // Alias PATCH to PUT for partial updates
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const deleted = await purchaseQueries.delete(params.id);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting purchase:', error);
    return NextResponse.json({ error: 'Failed to delete purchase' }, { status: 500 });
  }
}
