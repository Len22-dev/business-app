import { NextRequest, NextResponse } from 'next/server'
import { businessQueries } from '@/lib/drizzle/queries/business-queries'
import { AuthChecker } from '@/hooks/userCherker'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {

  try {
    const {user} = await AuthChecker()
    if(!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get userId from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Verify the requesting user matches the userId or has permission
    if (user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get businesses for user with pagination
    const paginationData = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    }

    const result = await businessQueries.getByUserId(userId, paginationData)
    
    return NextResponse.json({
      businesses: result.businesses,
      total: result.total,
      success: true,
    })

  } catch (error) {
    console.error('Error fetching businesses:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
   // const {user} = await AuthChecker()
   const supabase = await createClient()
   const {data: {user}} = await supabase.auth.getUser()
   if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
   }

    // Parse request body
    const businessData = await request.json()
    
    // Create business with owner
    const result = await businessQueries.createWithOwner(businessData, user.id)
    
    return NextResponse.json({
      business: result.business,
      businessUser: result.businessUser,
      success: true,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating business:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}