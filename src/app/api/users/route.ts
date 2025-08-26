// app/api/users/route.ts

import { AuthChecker } from "@/hooks/userCherker";
import { userQueries } from "@/lib/drizzle/queries/user-queries";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await AuthChecker();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await userQueries.getUserById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const user = await userQueries.createUser(userData);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const userData = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await userQueries.updateUser(userId, userData);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
