import { NextRequest, NextResponse } from 'next/server';
import { workflowQueries } from '@/lib/drizzle/queries/workFlow-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const workflow = await workflowQueries.getWorkFlowById(id);
      if (!workflow) {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
      }
      return NextResponse.json(workflow);
    }
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const workflows = await workflowQueries.getWorkFlowsByBusiness(businessId);
    return NextResponse.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await AuthChecker();
    const data = await request.json();
    const workflow = await workflowQueries.createWorkFlow(data);
    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Workflow id is required' }, { status: 400 });
    }
    const data = await request.json();
    const workflow = await workflowQueries.updateWorkFlow(id, data);
    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Workflow id is required' }, { status: 400 });
    }
    await workflowQueries.deleteWorkFlow(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}
