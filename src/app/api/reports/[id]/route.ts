import { NextRequest, NextResponse } from 'next/server';
import { reportQueries } from '@/lib/drizzle/queries/report-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const report = await reportQueries.getById(params.id);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const updated = await reportQueries.update(params.id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: { params: { id: string } }) {
  return PUT(request, ctx); // Alias PATCH to PUT for partial updates
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const deleted = await reportQueries.delete(params.id);
    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
