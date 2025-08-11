import { NextRequest, NextResponse } from 'next/server';
import { locationQueries } from '@/lib/drizzle/queries/location-queries';
// import { AuthChecker } from '@/hooks/userCherker'; // Uncomment if you want auth

export async function GET(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
    }

    // const filters: Record<string, string> = {};
    // let page = 1;
    // let limit = 50;

    // for (const [key, value] of searchParams.entries()) {
    //   if (["search", "isActive"].includes(key)) filters[key] = value;
    //   if (key === "page") page = Number(value);
    //   if (key === "limit") limit = Number(value);
    // }

    const result = await locationQueries.getMany(businessId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // await AuthChecker(); // Uncomment if you want auth
    const data = await request.json();
    
    // Extract categoryData from the request
    const locationData = data.locationData || data;
    
    const location = await locationQueries.create(locationData);
    return NextResponse.json(location, { status: 201 });
  } catch (error: any) {
    console.error('Error creating location:', error);
    
    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Validation failed', 
        message: error.message 
      }, { status: 400 });
    }
    
    if (error.name === 'DatabaseError') {
      return NextResponse.json({ 
        error: 'Database error', 
        message: error.message 
      }, { status: 500 });
    }
    
    // Generic error response
    return NextResponse.json({ 
      error: 'Failed to create location',
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}