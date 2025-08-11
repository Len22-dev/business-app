import { NextRequest, NextResponse } from 'next/server';
import { subscriptionQueries } from '@/lib/drizzle/queries/subscription-queries';
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
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    if (status) queryParams.status = status;
    if (plan) queryParams.plan = plan;
    if (page) queryParams.page = Number(page);
    if (limit) queryParams.limit = Number(limit);
    const result = await subscriptionQueries.getMany(queryParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const subscription = await subscriptionQueries.create(data);
    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
