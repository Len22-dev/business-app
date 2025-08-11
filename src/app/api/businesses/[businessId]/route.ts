import { NextRequest, NextResponse } from 'next/server'
import { businessQueries } from '@/lib/drizzle/queries/business-queries'
import { AuthChecker } from '@/hooks/userCherker'

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
   const {user} = await AuthChecker()

    const { businessId } = await params
    
    // Get business by ID
    const business = await businessQueries.getById(businessId)
    console.log("Fetched business:", businessId);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this business
    const userRole = await businessQueries.getUserRole(businessId, user.id)
    
    if (!userRole) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      business,
      userRole: userRole.role,
      success: true,
    })

  } catch (error) {
    console.error('Error fetching business:', error)
    
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const {user} = await AuthChecker()

    const { businessId } =await params
    
    // Check if user has permission to update this business
    const userRole = await businessQueries.getUserRole(businessId, user.id)
    
    if (!userRole || !['owner', 'admin'].includes(userRole.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Parse request body
    const businessData = await request.json()
    
    // Update business
    const updatedBusiness = await businessQueries.update(businessId, businessData)
    
    return NextResponse.json({
      business: updatedBusiness,
      success: true,
    })

  } catch (error) {
    console.error('Error updating business:', error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
   const {user} = await AuthChecker()

    const { businessId } = await params
    
    // Check if user is owner of this business
    const userRole = await businessQueries.getUserRole(businessId, user.id)
    
    if (!userRole || userRole.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only business owners can delete businesses' },
        { status: 403 }
      )
    }

    // Soft delete business
    await businessQueries.softDelete(businessId)
    
    return NextResponse.json({
      success: true,
      message: 'Business deleted successfully',
    })

  } catch (error) {
    console.error('Error deleting business:', error)
    
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