import { NextRequest, NextResponse } from 'next/server'
import { businessQueries } from '@/lib/drizzle/queries/business-queries';
import { AuthChecker } from '@/hooks/userCherker';

export async function GET(
  request: NextRequest,
  { params }: { params: { businessId: string; userId: string } }
) {
  try {
    const {user} = await AuthChecker()

    const { businessId, userId } = await params
    
    // Check if requesting user has access to this business
    const requestingUserRole = await businessQueries.getUserRole(businessId, user.id)
    
    if (!requestingUserRole) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get user role in business
    const userRole = await businessQueries.getUserRole(businessId, userId)
    
    if (!userRole) {
      return NextResponse.json(
        { error: 'User not found in business' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      role: userRole.role,
      permissions: userRole.permissions,
      isActive: userRole.isActive,
      success: true,
    })

  } catch (error) {
    console.error('Error fetching user role:', error)
    
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
  { params }: { params: { businessId: string; userId: string } }
) {
  try {
   const {user} = await AuthChecker()

    const { businessId, userId } = params
    
    // Check if requesting user has permission to update roles
    const requestingUserRole = await businessQueries.getUserRole(businessId, user.id)
    
    if (!requestingUserRole || !['owner', 'admin'].includes(requestingUserRole.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Parse request body
    const { role, permissions } = await request.json()
    
    // Prevent non-owners from creating owners
    if (role === 'owner' && requestingUserRole.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only owners can assign owner role' },
        { status: 403 }
      )
    }

    // Update user role (this would need to be implemented in your queries)
    // For now, we'll use the addUser method with updated role
    const updatedUser = await businessQueries.addUser(businessId, userId, role, permissions)
    
    return NextResponse.json({
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      success: true,
    })

  } catch (error) {
    console.error('Error updating user role:', error)
    
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