import { NextRequest, NextResponse } from 'next/server';
import { documentQueries } from '@/lib/drizzle/queries/document-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const document = await documentQueries.getById(params.id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    const document = await documentQueries.update(params.id, data);
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const document = await documentQueries.delete(params.id);
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
