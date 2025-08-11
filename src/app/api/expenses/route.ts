import { NextRequest, NextResponse } from 'next/server';
import { expenseQueries } from '@/lib/drizzle/queries/expense-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const filters: Record<string, string> = {};
    let page = 1;
    let limit = 10;
    for (const [key, value] of searchParams.entries()) {
      if (["status", "categoryId", "vendorId", "search", "startDate", "endDate"].includes(key)) filters[key] = value;
      if (key === 'page') page = Number(value);
      if (key === 'limit') limit = Number(value);
    }
    const result = await expenseQueries.getMany(businessId, filters, { page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const expense = await expenseQueries.create(data);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
