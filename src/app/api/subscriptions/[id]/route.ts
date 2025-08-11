import { NextRequest, NextResponse } from 'next/server';
import { subscriptionQueries } from '@/lib/drizzle/queries/subscription-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const subscription = await subscriptionQueries.getById(params.id);
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const subscription = await subscriptionQueries.update(params.id, data);
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const subscription = await subscriptionQueries.delete(params.id);
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}
