import { NextResponse } from 'next/server';
import { verifyPayment, rejectPayment, getPendingPayments } from '@/services/paymentService';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    
    const pendingPayments = await getPendingPayments(limit);
    
    return NextResponse.json({
      success: true,
      payments: pendingPayments
    });
    
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { paymentId, action, reason, verifierEmail } = await request.json();
    
    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'Payment ID and action are required' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (action === 'verify') {
      result = await verifyPayment(paymentId, verifierEmail);
    } else if (action === 'reject') {
      if (!reason) {
        return NextResponse.json(
          { error: 'Reason is required for rejection' },
          { status: 400 }
        );
      }
      result = await rejectPayment(paymentId, reason, verifierEmail);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "verify" or "reject"' },
        { status: 400 }
      );
    }
    
    if (!result) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Payment ${action}ed successfully`,
      payment: result
    });
    
  } catch (error) {
    console.error('Error processing payment verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
