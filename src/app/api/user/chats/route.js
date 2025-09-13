import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/services/userService';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await getUserByEmail(email);
    
    return NextResponse.json({
      found: !!user,
      user: user ? {
        email: user.email,
        name: user.name,
        paidCategories: user.paidCategories
      } : null
    });
    
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
