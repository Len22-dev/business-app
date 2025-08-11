import { NextRequest, NextResponse } from 'next/server';
import { notificationQueries } from '@/lib/drizzle/queries/notification-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const notification = await notificationQueries.getById(params.id);
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json({ error: 'Failed to fetch notification' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const notification = await notificationQueries.update(params.id, data);
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const notification = await notificationQueries.delete(params.id);
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
