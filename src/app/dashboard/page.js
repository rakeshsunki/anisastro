"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  { title: "Love", icon: "💕", color: "from-rose-500 to-fuchsia-500" },
  { title: "Life", icon: "🌿", color: "from-emerald-500 to-teal-500" },
  { title: "Career", icon: "⭐", color: "from-indigo-500 to-cyan-500" },
  { title: "Partner", icon: "💫", color: "from-amber-500 to-orange-600" },
  { title: "Future", icon: "🔮", color: "from-sky-500 to-violet-600" }
];

function ChatHistory({ category, messages, onSendMessage }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const messagesRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if payment is confirmed when there's text input
    if (input.trim() && !paymentConfirmed) {
      alert('Please confirm that you have paid ₹10 before submitting your question.');
      return;
    }

    setIsLoading(true);
    const newMessage = {
      id: Date.now(),
      text: input.trim(),
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    await onSendMessage(category.title, newMessage);
    setInput("");
    setPaymentConfirmed(false); // Reset checkbox after successful submission
    setIsLoading(false);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesRef.current && messagesRef.current.lastElementChild) {
      messagesRef.current.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesRef]);

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col w-full h-[70vh] md:h-[65vh] xl:h-[600px] max-h-[calc(100vh-180px)]">
      {/* Header */}
      <div className={`bg-gradient-to-r ${category.color} p-4 rounded-t-xl text-white`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <h3 className="text-lg font-semibold truncate">{category.title} Chat</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3" ref={messagesRef}>
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center pt-10 text-sm">No messages yet. Start a conversation!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[80%] break-words ${
                message.type === 'user'
                  ? 'bg-indigo-100 text-indigo-900 ml-auto'
                  : message.role === 'admin'
                  ? 'bg-emerald-100 text-emerald-900 border-l-4 border-emerald-500'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'admin' && (
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-emerald-700">Admin Response</span>
                </div>
              )}
              <p className="text-sm leading-snug whitespace-pre-wrap">{message.text}</p>
              <span className="text-[10px] text-gray-500 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Input with Payment (sticks to bottom) */}
      <div className="border-t bg-white/95">
        <form onSubmit={handleSend} className="p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${category.title.toLowerCase()}...`}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm mb-3"
            disabled={isLoading}
          />
          
          {/* PhonePe QR Code */}
          {input.trim() && (
            <div className="mb-3 text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 inline-block">
                <div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center bg-white rounded border border-gray-200">
                  <img 
                    src="/phonepay.jpeg" 
                    alt="PhonePe QR Code" 
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-1">Scan to Pay ₹10</p>
                <p className="text-[10px] text-gray-500">Pay using any UPI app</p>
              </div>
            </div>
          )}

          {/* Payment Confirmation Checkbox */}
          {input.trim() && (
            <div className="mb-3 flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="paymentConfirm"
                checked={paymentConfirmed}
                onChange={(e) => setPaymentConfirmed(e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label htmlFor="paymentConfirm" className="text-sm text-gray-700 cursor-pointer">
                I confirm that I have paid ₹10
              </label>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !input.trim() || (input.trim() && !paymentConfirmed)}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isLoading ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [userChats, setUserChats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserChats = useCallback(async () => {
    try {
      // Simulate API call to fetch user's chat history
      const response = await fetch(`/api/user/chats/${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserChats(data.chats || {});
      } else {
        // For development, simulate some existing chats
        const simulatedChats = {
          "Love": [
            {
              id: 1,
              text: "What does my birth chart say about my love life?",
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              type: 'user'
            },
            {
              id: 2,
              text: "Based on your Venus placement, you tend to value deep emotional connections...",
              timestamp: new Date(Date.now() - 86300000).toISOString(),
              type: 'ai'
            }
          ]
        };
        setUserChats(simulatedChats);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      // Set empty chats on error
      setUserChats({});
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      router.push('/');
      return;
    }
    fetchUserChats();
  }, [email, router, fetchUserChats]);

  const handleSendMessage = async (category, message) => {
    try {
      // Update local state immediately
      setUserChats(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), message]
      }));

      // Send to API
      await fetch('/api/user/chats/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          category,
          message
        }),
      });

      // Simulate AI response (in production, this would come from your AI service)
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: `Thank you for your question about ${category.toLowerCase()}. Let me provide some cosmic insights...`,
          timestamp: new Date().toISOString(),
          type: 'ai'
        };
        
        setUserChats(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), aiResponse]
        }));
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your cosmic insights...</p>
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
                <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">AnisAstro Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-indigo-200 text-sm">{email}</span>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-x-hidden">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 overflow-x-hidden">
            <h2 className="text-xl font-semibold text-white mb-4">Your Categories</h2>
            <div className="space-y-3">
              {categories.map((category) => {
                const messageCount = userChats[category.title]?.length || 0;
                return (
                  <button
                    key={category.title}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedCategory?.title === category.title
                        ? 'border-white bg-white/20 text-white'
                        : 'border-white/20 bg-white/10 text-indigo-200 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <div className="font-medium">{category.title}</div>
                        <div className="text-xs opacity-70">
                          {messageCount} messages
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            {selectedCategory ? (
              <ChatHistory
                category={selectedCategory}
                messages={userChats[selectedCategory.title] || []}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="bg-white/10 rounded-xl p-8 text-center text-white">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">Welcome Back!</h3>
                <p className="text-indigo-200">
                  Select a category from the sidebar to continue your cosmic conversation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
