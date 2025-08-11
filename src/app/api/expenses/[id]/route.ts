import { NextRequest, NextResponse } from 'next/server';
import { expenseQueries } from '@/lib/drizzle/queries/expense-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const expense = await expenseQueries.getById(params.id);
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const updated = await expenseQueries.update(params.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return PUT(request, ctx); // Alias PATCH to PUT for partial updates
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const deleted = await expenseQueries.delete(params.id);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
