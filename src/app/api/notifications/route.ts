import { NextRequest, NextResponse } from 'next/server';
import { notificationQueries } from '@/lib/drizzle/queries/notification-queries';
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
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    if (type) queryParams.type = type;
    if (status) queryParams.status = status;
    if (search) queryParams.search = search;
    if (page) queryParams.page = Number(page);
    if (limit) queryParams.limit = Number(limit);
    const result = await notificationQueries.getMany(queryParams);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const notification = await notificationQueries.create(data);
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
