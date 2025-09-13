import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/services/userService';
import { getAllUserMessages } from '@/services/messageService';

export async function GET(request, context) {
  try {
    // Next.js 15+ may provide an async params object; ensure we await safely.
    let emailParam;
    try {
      const ctx = await Promise.resolve(context);
      // params itself might be a promise in edge cases
      const params = await Promise.resolve(ctx.params);
      emailParam = params?.email;
    } catch {
      // Fallback (older behavior)
      emailParam = context?.params?.email;
    }

    if (!emailParam) {
      return NextResponse.json({ error: 'Email param missing' }, { status: 400 });
    }

    const email = decodeURIComponent(emailParam);
    
    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get all user messages grouped by category
    const chats = await getAllUserMessages(email);
    
    return NextResponse.json({
      success: true,
      chats: chats,
      profile: {
        name: user.name,
        email: user.email,
        dob: user.dob,
        placeOfBirth: user.placeOfBirth,
        paidCategories: user.paidCategories
      }
    });
    
  } catch (error) {
    console.error('Error fetching user chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
