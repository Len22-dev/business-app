import { NextRequest, NextResponse } from 'next/server'
import { inventoryQueries } from '@/lib/drizzle/queries/general-queries'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    //const userId = searchParams.get('userId')
    const businessId = searchParams.get('businessId')

    if ( !businessId) {
      return NextResponse.json(
        { error: ' businessId are required' },
        { status: 400 }
      )
    }

    const data = await inventoryQueries.getInventory({ businessId })
    return NextResponse.json(data)
    
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}