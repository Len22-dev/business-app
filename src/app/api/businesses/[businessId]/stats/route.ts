// 7. API ROUTES (app/api/businesses/[id]/stats/route.ts)
import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/drizzle/queries/business-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
    const businessId =  (await params).businessId;
  try {
     await AuthChecker()
    const stats = await getDashboardStats(businessId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}