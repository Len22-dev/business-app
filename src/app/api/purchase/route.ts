import { NextRequest, NextResponse } from 'next/server';
import { purchaseQueries } from '@/lib/drizzle/queries/purchase-queries';
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
      if (["status", "vendorId", "search", "startDate", "endDate"].includes(key)) filters[key] = value;
      if (key === 'page') page = Number(value);
      if (key === 'limit') limit = Number(value);
    }
    const result = await purchaseQueries.getByBusinessId(businessId, filters, { page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    // Expect data to have { purchaseData, items }
    const purchase = await purchaseQueries.createWithItems(data.purchaseData, data.items);
    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
  }
}
