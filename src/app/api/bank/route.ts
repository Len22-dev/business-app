import { NextRequest, NextResponse } from 'next/server';
import { bankQueries } from '@/lib/drizzle/queries/bank-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }

    // Build query parameters
    const queryParams: Record<string, string | number> = { businessId };
    
    // Add optional filters
    const search = searchParams.get('search');
    if (search) queryParams.search = search;
    
    // Add pagination
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    if (page) queryParams.page = Number(page);
    if (limit) queryParams.limit = Number(limit);
    
    // Add sorting
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    if (sortBy) queryParams.sortBy = sortBy;
    if (sortOrder) queryParams.sortOrder = sortOrder;

    const result = await bankQueries.getMany(queryParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching banks:', error);
    return NextResponse.json({ error: 'Failed to fetch banks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const bank = await bankQueries.create(data);
    return NextResponse.json(bank, { status: 201 });
  } catch (error) {
    console.error('Error creating bank:', error);
    return NextResponse.json({ error: 'Failed to create bank' }, { status: 500 });
  }
}
