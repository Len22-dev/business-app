import { NextRequest, NextResponse } from 'next/server';
import { taxQueries } from '@/lib/drizzle/queries/tax-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const taxRate = await taxQueries.getTaxRateById(id);
      if (!taxRate) {
        return NextResponse.json({ error: 'Tax rate not found' }, { status: 404 });
      }
      return NextResponse.json(taxRate);
    }
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const taxRates = await taxQueries.getTaxRatesByBusiness(businessId);
    return NextResponse.json(taxRates);
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await AuthChecker();
    const data = await request.json();
    const taxRate = await taxQueries.createTaxRate(data);
    return NextResponse.json(taxRate, { status: 201 });
  } catch (error) {
    console.error('Error creating tax rate:', error);
    return NextResponse.json({ error: 'Failed to create tax rate' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Tax rate id is required' }, { status: 400 });
    }
    const data = await request.json();
    const taxRate = await taxQueries.updateTaxRate(id, data);
    return NextResponse.json(taxRate);
  } catch (error) {
    console.error('Error updating tax rate:', error);
    return NextResponse.json({ error: 'Failed to update tax rate' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Tax rate id is required' }, { status: 400 });
    }
    await taxQueries.deleteTaxRate(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tax rate:', error);
    return NextResponse.json({ error: 'Failed to delete tax rate' }, { status: 500 });
  }
}
