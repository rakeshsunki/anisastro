"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call to fetch user's chat history
      const response = await fetch('/api/user/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.found) {
          // User exists, redirect to their chat dashboard
          router.push(`/dashboard?email=${encodeURIComponent(email)}`);
        } else {
          alert('No account found with this email. Please register as a new user.');
        }
      } else {
        // For now, simulate finding user data
        // In production, remove this and handle the actual response
        setTimeout(() => {
          router.push(`/dashboard?email=${encodeURIComponent(email)}`);
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // For development, still redirect to dashboard
      setTimeout(() => {
        router.push(`/dashboard?email=${encodeURIComponent(email)}`);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden max-w-full">
      {/* Background decorations */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Stars layer */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "3px 3px",
            backgroundPosition: "0 0",
          }}
        />
        {/* Planets */}
        <div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(99,102,241,.6) 35%, rgba(79,70,229,.55) 55%, rgba(30,27,75,.7) 100%)",
            boxShadow: "0 30px 90px rgba(79,70,229,.35)",
          }}
        />
        <div
          className="absolute bottom-[-6rem] right-[-6rem] h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, rgba(255,255,255,.8), rgba(20,184,166,.5) 40%, rgba(6,182,212,.55) 60%, rgba(15,118,110,.7) 100%)",
            boxShadow: "0 30px 90px rgba(6,182,212,.35)",
          }}
        />
        <div
          className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(236,72,153,.6) 45%, rgba(147,51,234,.6) 75%)",
            boxShadow: "0 10px 40px rgba(147,51,234,.35)",
          }}
        />
        <div
          className="absolute left-1/3 top-3/4 h-2 w-2 rounded-full bg-white/80"
          style={{ boxShadow: "0 0 10px 4px rgba(255,255,255,.6)" }}
        />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z" />
                </svg>
              </div>
              <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                AnisAstro
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Your Cosmic Journey
            </h1>
            <p className="text-indigo-200/80 text-lg">
              Discover personalized astrology insights and cosmic guidance
            </p>
          </div>

          <div className="space-y-6">
            

            

            {/* New User Section */}
            <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New to AnisAstro
              </h2>
              <p className="text-indigo-200/70 text-sm mb-4">
                Start your cosmic journey with personalized astrology insights
              </p>
              <button
                onClick={navigateToRegister}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white font-medium shadow-sm transition hover:from-emerald-500 hover:to-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  REGISTER TO ASK
                </span>
              </button>
            </div>
          </div>
          {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-950 px-4 text-indigo-300">or</span>
              </div>
            </div>
          {/* Returning User Section */}
            <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Returning User
              </h2>
              <p className="text-indigo-200/70 text-sm mb-4">
                Access your previous conversations and cosmic insights
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-indigo-200/60 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-medium shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Find My Chats
                    </span>
                  )}
                </button>
              </form>
            </div>

          {/* Admin Access */}
          <div className="text-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Portal
            </Link>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-2xl mb-1">💕</div>
              <div className="text-xs text-indigo-200/70">Love Insights</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xs text-indigo-200/70">Career Guidance</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-2xl mb-1">💫</div>
              <div className="text-xs text-indigo-200/70">Compatibility</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-2xl mb-1">🔮</div>
              <div className="text-xs text-indigo-200/70">Future Predictions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}