"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminChats() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('Error verifying password');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/admin/chats');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchUserMessages = async (userEmail) => {
    try {
      const response = await fetch(`/api/user/chats/${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        // Flatten all messages from all categories into a single array
        const allMessages = [];
        if (data.chats) {
          Object.values(data.chats).forEach(categoryMessages => {
            allMessages.push(...categoryMessages);
          });
        }
        // Sort by timestamp
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        // Convert to format expected by admin interface
        return allMessages.map(msg => ({
          role: msg.role || (msg.type === 'user' ? 'user' : 'admin'),
          content: msg.text,
          timestamp: msg.timestamp,
        }));
      }
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
    return [];
  };

  const handleUserSelect = async (user) => {
    const messages = await fetchUserMessages(user.email);
    setSelectedUser({ ...user, messages });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSendingMessage(true);
    try {
      const response = await fetch('/api/admin/chats/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: selectedUser.email,
          message: newMessage.trim(),
          role: 'admin'
        }),
      });

      if (response.ok) {
        const newMsg = {
          role: 'admin',
          content: newMessage.trim(),
          timestamp: new Date(),
        };
        setSelectedUser(prev => ({
          ...prev,
          messages: [...prev.messages, newMsg]
        }));
        setNewMessage('');
        fetchConversations(); // Refresh conversation list
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setSendingMessage(false);
    }
  };

  // Password screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Chat Portal</h2>
            <p className="text-indigo-200">Enter admin password to access user conversations</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-indigo-200/60 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-medium transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Access Chat Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-x-hidden max-w-full">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Chat Inbox</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Payment Dashboard
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
            <Link
              href="/"
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)] overflow-x-hidden">
          {/* Conversations List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 overflow-x-hidden">
            <h3 className="text-lg font-semibold text-white mb-4">Active Conversations</h3>
            <div className="space-y-2 overflow-y-auto max-h-full">
              {conversations.length === 0 ? (
                <p className="text-indigo-200 text-sm">No conversations yet</p>
              ) : (
                conversations.map((user) => (
                  <div
                    key={user.email}
                    onClick={() => handleUserSelect(user)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.email === user.email
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm opacity-70">
                      {user.categories?.join(', ') || 'No categories'}
                    </div>
                    {user.lastMessage && (
                      <div className="text-xs opacity-60 truncate mt-1">
                        {user.lastMessage}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/20">
                  <h3 className="text-lg font-semibold text-white">{selectedUser.email}</h3>
                  <p className="text-indigo-200 text-sm">
                    Categories: {selectedUser.categories?.join(', ') || 'None'}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {selectedUser.messages?.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'admin'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/20">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-indigo-200/60 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-indigo-200">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}