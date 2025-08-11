import { NextRequest, NextResponse } from 'next/server';
import { reportQueries } from '@/lib/drizzle/queries/report-queries';
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
      if (["type", "search", "startDate", "endDate"].includes(key)) filters[key] = value;
      if (key === 'page') page = Number(value);
      if (key === 'limit') limit = Number(value);
    }
    const result = await reportQueries.getMany({businessId, filters,  page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const report = await reportQueries.create(data);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
