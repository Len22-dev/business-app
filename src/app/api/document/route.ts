import { NextRequest, NextResponse } from 'next/server';
import { documentQueries } from '@/lib/drizzle/queries/document-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const queryParams: Record<string, string | number> = { businessId };
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    if (type) queryParams.type = type;
    if (search) queryParams.search = search;
    if (page) queryParams.page = Number(page);
    if (limit) queryParams.limit = Number(limit);
    const result = await documentQueries.getMany(queryParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const document = await documentQueries.create(data);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
