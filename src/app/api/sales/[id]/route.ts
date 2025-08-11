import { NextRequest, NextResponse } from 'next/server';
import { saleQueries } from '@/lib/drizzle/queries/sale-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const sale = await saleQueries.getById(params.id);
    if (!sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }
    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const updated = await saleQueries.update(params.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating sale:', error);
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return PUT(request, ctx); // Alias PATCH to PUT for partial updates
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    // Optionally, accept a reason in the body
    let reason: string | undefined = undefined;
    try {
      const body = await request.json();
      if (body && typeof body.reason === 'string') reason = body.reason;
    } catch {}
    const cancelled = await saleQueries.cancel(params.id, reason);
    return NextResponse.json(cancelled);
  } catch (error) {
    console.error('Error cancelling sale:', error);
    return NextResponse.json({ error: 'Failed to cancel sale' }, { status: 500 });
  }
}
