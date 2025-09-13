import { NextResponse } from 'next/server';
import { getAllUsers } from '../../../../services/userService';
import { getMessagesByUser } from '../../../../services/messageService';

export async function GET() {
  try {
    // Get all users who have registered
    const users = await getAllUsers();
    
    // Get the last message for each user to show in the conversation list
    const conversations = await Promise.all(
      users.map(async (user) => {
        const messages = await getMessagesByUser(user.email);
        const lastMessage = messages.length > 0 
          ? messages[messages.length - 1].content 
          : null;
        
        return {
          email: user.email,
          categories: user.paidCategories,
          lastMessage,
          messageCount: messages.length,
          lastMessageTime: messages.length > 0 
            ? messages[messages.length - 1].timestamp 
            : user.createdAt
        };
      })
    );

    // Sort conversations by last message time (most recent first)
    conversations.sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    return NextResponse.json({
      success: true,
      conversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}