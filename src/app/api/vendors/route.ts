import { NextRequest, NextResponse } from 'next/server';
import { vendorQueries } from '@/lib/drizzle/queries/vendor-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const vendor = await vendorQueries.getVendorById(id);
      if (!vendor) {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
      return NextResponse.json(vendor);
    }
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const vendors = await vendorQueries.getVendorsByBusiness(businessId);
    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await AuthChecker();
    const data = await request.json();
    const vendor = await vendorQueries.createVendor(data);
    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json({ error: 'Failed to create vendor' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Vendor id is required' }, { status: 400 });
    }
    const data = await request.json();
    const vendor = await vendorQueries.updateVendor(id, data);
    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Vendor id is required' }, { status: 400 });
    }
    await vendorQueries.deleteVendor(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
