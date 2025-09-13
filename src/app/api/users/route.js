import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/services/userService';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    const { email, name, dob, placeOfBirth, phone } = userData;
    
    if (!email || !name || !dob || !placeOfBirth) {
      return NextResponse.json(
        { error: 'Email, name, date of birth, and place of birth are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = await createUser({
      email,
      name,
      dob,
      placeOfBirth,
      phone: phone || ''
    });
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        paidCategories: newUser.paidCategories
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
