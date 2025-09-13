import dbConnect from '@/lib/db/mongoose';
import { Message } from '@/models/Message';

export async function createMessage(messageData) {
  await dbConnect();
  
  const message = new Message({
    userEmail: messageData.userEmail.toLowerCase().trim(),
    category: messageData.category,
    text: messageData.text.trim(),
    role: messageData.role || 'user',
    metadata: messageData.metadata || {},
  });
  
  return await message.save();
}

export async function saveMessage(userEmail, text, role = 'user', category = 'General') {
  await dbConnect();
  
  const message = new Message({
    userEmail: userEmail.toLowerCase().trim(),
    category: category,
    text: text.trim(),
    role: role,
    metadata: {},
  });
  
  return await message.save();
}

export async function getMessagesByUserAndCategory(email, category, limit = 100) {
  await dbConnect();
  
  return await Message.find({
    userEmail: email.toLowerCase().trim(),
    category: category,
  })
    .select('-__v')
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
}

export async function getMessagesByUser(email) {
  await dbConnect();
  
  const messages = await Message.find({
    userEmail: email.toLowerCase().trim(),
  })
    .select('-__v')
    .sort({ createdAt: 1 })
    .lean();
  
  return messages.map(msg => ({
    id: msg._id.toString(),
    content: msg.text,
    role: msg.role,
    timestamp: msg.createdAt.toISOString(),
  }));
}

export async function getAllUserMessages(email, limit = 200) {
  await dbConnect();
  
  const messages = await Message.find({
    userEmail: email.toLowerCase().trim(),
  })
    .select('-__v')
    .sort({ createdAt: 1 })
    .limit(limit)
    .lean();
  
  // Group by category
  const groupedMessages = {};
  messages.forEach(msg => {
    if (!groupedMessages[msg.category]) {
      groupedMessages[msg.category] = [];
    }
    groupedMessages[msg.category].push({
      id: msg._id.toString(),
      text: msg.text,
      timestamp: msg.createdAt.toISOString(),
      type: msg.role === 'user' ? 'user' : 'ai',
      role: msg.role,
    });
  });
  
  return groupedMessages;
}

export async function markMessagesAsRead(email, category) {
  await dbConnect();
  
  return await Message.updateMany(
    {
      userEmail: email.toLowerCase().trim(),
      category: category,
      isRead: false,
    },
    { isRead: true }
  );
}

export async function getUnreadMessageCount(email, category = null) {
  await dbConnect();
  
  const query = {
    userEmail: email.toLowerCase().trim(),
    isRead: false,
  };
  
  if (category) {
    query.category = category;
  }
  
  return await Message.countDocuments(query);
}

export async function deleteUserMessages(email, category = null) {
  await dbConnect();
  
  const query = { userEmail: email.toLowerCase().trim() };
  if (category) {
    query.category = category;
  }
  
  return await Message.deleteMany(query);
}
