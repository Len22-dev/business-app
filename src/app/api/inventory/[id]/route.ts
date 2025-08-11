import { NextRequest, NextResponse } from 'next/server';
import { inventoryQueries } from '@/lib/drizzle/queries/inventory-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const inventoryRecord = await inventoryQueries.getById(params.id);
    if (!inventoryRecord) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
    }
    return NextResponse.json(inventoryRecord);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const updated = await inventoryQueries.update(params.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return PUT(request, ctx); // Alias PATCH to PUT for partial updates
}