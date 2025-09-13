import { NextResponse } from 'next/server';
import { createMessage } from '../../../../../services/messageService';
import { getAllUserMessages } from '../../../../../services/messageService';

export async function POST(request) {
  try {
    const { userEmail, message, role } = await request.json();

    console.log('Admin reply attempt:', { userEmail, messageLength: message?.length, role });

    if (!userEmail || !message || !role) {
      console.log('Missing required fields:', { userEmail: !!userEmail, message: !!message, role: !!role });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (role !== 'admin') {
      console.log('Invalid role provided:', role);
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Get user's messages to determine the most recent category
    console.log('Fetching user messages for:', userEmail);
    const userChats = await getAllUserMessages(userEmail);
    console.log('User chats found:', Object.keys(userChats));
    
    let recentCategory = 'Love'; // Default to 'Love' instead of 'General'
    
    // Find the most recent user message to get the category
    let latestTimestamp = null;
    Object.entries(userChats).forEach(([category, messages]) => {
      messages.forEach(msg => {
        if (msg.type === 'user') {
          const msgTime = new Date(msg.timestamp);
          if (!latestTimestamp || msgTime > latestTimestamp) {
            latestTimestamp = msgTime;
            recentCategory = category;
          }
        }
      });
    });

    console.log('Selected category for admin reply:', recentCategory);

    // Save the admin's reply message
    const savedMessage = await createMessage({
      userEmail,
      text: message,
      role: 'admin',
      category: recentCategory
    });

    console.log('Admin message saved successfully:', savedMessage._id);

    return NextResponse.json({
      success: true,
      message: savedMessage
    });

  } catch (error) {
    console.error('Error sending admin reply:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}