import { NextRequest, NextResponse } from 'next/server';
import { paymentQueries } from '@/lib/drizzle/queries/payment-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const payment = await paymentQueries.getById(params.id);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const updated = await paymentQueries.update(params.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return PUT(request, ctx); // Alias PATCH to PUT for partial updates
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const deleted = await paymentQueries.delete(params.id);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
