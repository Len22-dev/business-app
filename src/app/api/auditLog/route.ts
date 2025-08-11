import { NextRequest, NextResponse } from 'next/server';
import { auditLogsQueries } from '@/lib/drizzle/queries/auditLogs-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const log = await auditLogsQueries.getAuditLogById(id);
      if (!log) {
        return NextResponse.json({ error: 'Audit log not found' }, { status: 404 });
      }
      return NextResponse.json(log);
    }
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const logs = await auditLogsQueries.getAuditLogsByBusiness(businessId);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await AuthChecker();
    const data = await request.json();
    const log = await auditLogsQueries.createAuditLog(data);
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Audit log id is required' }, { status: 400 });
    }
    const data = await request.json();
    const log = await auditLogsQueries.updateAuditLog(id, data);
    return NextResponse.json(log);
  } catch (error) {
    console.error('Error updating audit log:', error);
    return NextResponse.json({ error: 'Failed to update audit log' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Audit log id is required' }, { status: 400 });
    }
    await auditLogsQueries.deleteAuditLog(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting audit log:', error);
    return NextResponse.json({ error: 'Failed to delete audit log' }, { status: 500 });
  }
}
