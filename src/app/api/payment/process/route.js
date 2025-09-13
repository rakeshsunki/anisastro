import { NextResponse } from 'next/server';
import { createPaymentVerification } from '@/services/paymentService';
import { getUserByEmail } from '@/services/userService';

export async function POST(request) {
  try {
    const { email, category, amount, question, paymentMethod } = await request.json();
    
    if (!email || !category || !amount || !question) {
      return NextResponse.json(
        { error: 'Email, category, amount, and question are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please register first.' },
        { status: 404 }
      );
    }
    
    // Create payment verification record
    const paymentRecord = await createPaymentVerification({
      userEmail: email,
      category,
      amount,
      question,
      paymentMethod: paymentMethod || 'manual'
    });
    
    return NextResponse.json({
      success: true,
      paymentId: paymentRecord._id,
      status: 'pending',
      message: 'Payment submission recorded. Verification pending.',
      category: category,
      amount: amount
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Payment processing failed',
        message: 'An error occurred while processing your payment. Please try again.'
      },
      { status: 500 }
    );
  }
}
