import { NextResponse } from 'next/server';
import { createMessage } from '@/services/messageService';
import { getUserByEmail } from '@/services/userService';

export async function POST(request) {
  try {
    const { email, category, message } = await request.json();
    
    if (!email || !category || !message) {
      return NextResponse.json(
        { error: 'Email, category, and message are required' },
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
    
    // Create the user message
    const savedMessage = await createMessage({
      userEmail: email,
      category: category,
      text: message.text,
      role: 'user',
      metadata: {
        messageId: message.id,
        timestamp: message.timestamp
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Message saved successfully',
      messageId: savedMessage._id
    });
    
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
