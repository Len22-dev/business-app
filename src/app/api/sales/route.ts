import { NextRequest, NextResponse } from 'next/server';
import { saleQueries } from '@/lib/drizzle/queries/sale-queries';
import { Item, TransformedSaleData } from '@/types';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth


export async function GET(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }
    const filters: Record<string, string> = {};
    let page = 1;
    let limit = 10;
    for (const [key, value] of searchParams.entries()) {
      if (["status", "customerId", "search", "startDate", "endDate"].includes(key)) filters[key] = value;
      if (key === "page") page = Number(value);
      if (key === "limit") limit = Number(value);
    }
    const result = await saleQueries.getByBusinessId(businessId, filters, { page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
   try {
    const data = await request.json();
    
    console.log('Received data:', JSON.stringify(data, null, 2)); // Debug log
    
    // Validate required fields
    if (!data.saleData?.businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }
    
    if (!data.saleData?.customerName) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
    }
    
    // Validate items have productId for sales
    const invalidItems = data.items.filter((item: Item) => !item.productId);
    if (invalidItems.length > 0) {
      return NextResponse.json({ 
        error: 'All items must have a valid product selected from inventory' 
      }, { status: 400 });
    }

    // Transform frontend data to match your database schema
    const transformedSaleData: TransformedSaleData = {
      businessId: data.saleData.businessId,
      customerId: undefined, // You might want to create/lookup customer by name
      customerName: data.saleData.customerName,
      saleNumber: `SALE-${Date.now()}`,
      saleDate: new Date(data.saleData.saleDate),
      dueDate: data.saleData.dueDate ? new Date(data.saleData.dueDate) : undefined,
      subtotal: data.saleData.totalAmount,
      tax: 0, // Set appropriate tax calculation
      discount: 0, // Set appropriate discount
      totalAmount: data.saleData.totalAmount,
      salesStatus: data.saleData.status === 'completed' ? 'sold' : 'pending',
      paymentMethod: data.saleData.paymentMethod || 'cash',
      paymentStatus: data.saleData.status || 'pending',
      locationId: data.saleData.locationId || '', 
      createdBy: data.saleData.userId,
      description: data.saleData.description,
      bankId: data.saleData.bankId,
      cardId: data.saleData.cardId,
    };

    // Transform items data
    const transformedItems = data.items.map((item: Item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    console.log('Transformed sale data:', JSON.stringify(transformedSaleData, null, 2)); // Debug log
    console.log('Transformed items:', JSON.stringify(transformedItems, null, 2)); // Debug log

    const sale = await saleQueries.createWithItems(transformedSaleData, transformedItems);
    return NextResponse.json(sale, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating sale:', error);
    
    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.message 
      }, { status: 400 });
    }
    
    if (error.name === 'DatabaseError') {
      return NextResponse.json({ 
        error: 'Database error', 
        details: error.message 
      }, { status: 500 });
    }
    
    // Generic error response
    return NextResponse.json({ 
      error: 'Failed to create sale',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}