import { NextRequest, NextResponse } from 'next/server';
import { budgetingQueries } from '@/lib/drizzle/queries/budgeting-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'budget' or 'fiscalPeriod'
    const id = searchParams.get('id');
    if (type === 'fiscalPeriod') {
      if (id) {
        const period = await budgetingQueries.getFiscalPeriodById(id);
        if (!period) {
          return NextResponse.json({ error: 'Fiscal period not found' }, { status: 404 });
        }
        return NextResponse.json(period);
      }
      const businessId = searchParams.get('businessId');
      if (!businessId) {
        return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
      }
      const periods = await budgetingQueries.getFiscalPeriodsByBusiness(businessId);
      return NextResponse.json(periods);
    } else {
      if (id) {
        const budget = await budgetingQueries.getBudgetById(id);
        if (!budget) {
          return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
        }
        return NextResponse.json(budget);
      }
      const businessId = searchParams.get('businessId');
      if (!businessId) {
        return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
      }
      const budgets = await budgetingQueries.getBudgetsByBusiness(businessId);
      return NextResponse.json(budgets);
    }
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const data = await request.json();
    if (type === 'fiscalPeriod') {
      const period = await budgetingQueries.createFiscalPeriod(data);
      return NextResponse.json(period, { status: 201 });
    } else {
      const budget = await budgetingQueries.createBudget(data);
      return NextResponse.json(budget, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating budget/fiscal period:', error);
    return NextResponse.json({ error: 'Failed to create budget/fiscal period' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: `${type === 'fiscalPeriod' ? 'Fiscal period' : 'Budget'} id is required` }, { status: 400 });
    }
    const data = await request.json();
    if (type === 'fiscalPeriod') {
      const period = await budgetingQueries.updateFiscalPeriod(id, data);
      return NextResponse.json(period);
    } else {
      const budget = await budgetingQueries.updateBudget(id, data);
      return NextResponse.json(budget);
    }
  } catch (error) {
    console.error('Error updating budget/fiscal period:', error);
    return NextResponse.json({ error: 'Failed to update budget/fiscal period' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: `${type === 'fiscalPeriod' ? 'Fiscal period' : 'Budget'} id is required` }, { status: 400 });
    }
    if (type === 'fiscalPeriod') {
      await budgetingQueries.deleteFiscalPeriod(id);
    } else {
      await budgetingQueries.deleteBudget(id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting budget/fiscal period:', error);
    return NextResponse.json({ error: 'Failed to delete budget/fiscal period' }, { status: 500 });
  }
}
