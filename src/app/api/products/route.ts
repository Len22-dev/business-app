import { NextRequest, NextResponse } from 'next/server';
import { productQueries } from '@/lib/drizzle/queries/product-queries';
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
    let sortBy = 'created_at';
    let sortOrder = 'desc';
    for (const [key, value] of searchParams.entries()) {
      if (["categoryId", "search", "isActive"].includes(key)) filters[key] = value;
      if (key === 'page') page = Number(value);
      if (key === 'limit') limit = Number(value);
      if (key === 'sortBy') sortBy = value;
      if (key === 'sortOrder') sortOrder = value;
    }
    const offset = (page - 1) * limit;
    const result = await productQueries.getMany({
      businessId,
      ...filters,
      sortBy,
      sortOrder,
      limit,
      offset,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    
    // Extract productData from the request
    const productData = data.productData || data;
    
    const product = await productQueries.create(productData);
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    
    // Handle different types of errors
    if (error && typeof error === 'object' && 'name' in error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json({ 
          error: 'Validation failed', 
          message: (error as Error).message 
        }, { status: 400 });
      }
      
      if (error.name === 'DatabaseError') {
        return NextResponse.json({ 
          error: 'Database error', 
          message: (error as Error).message 
        }, { status: 500 });
      }
    }
    
    // Generic error response
    return NextResponse.json({ 
      error: 'Failed to create product',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
