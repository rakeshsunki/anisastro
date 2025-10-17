"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [showPaymentDashboard, setShowPaymentDashboard] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
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
        fetchPendingPayments();
      } else {
        alert('Invalid password! Access denied.');
        setPassword('');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('Error verifying password. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPendingPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentAction = async (paymentId, action, reason = '') => {
    setProcessingId(paymentId);
    
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          action,
          reason,
          verifierEmail: 'admin@anisastro.com'
        }),
      });

      if (response.ok) {
        await fetchPendingPayments(); // Refresh the list
        
        if (action === 'verify') {
          const shouldGoToChat = confirm(
            'Payment verified successfully! Would you like to go to the chat to respond to this user?'
          );
          if (shouldGoToChat) {
            window.location.href = '/admin/chats';
          }
        } else {
          alert(`Payment ${action}ed successfully!`);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    } finally {
      setProcessingId(null);
    }
  };

  // Password verification screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-indigo-200">Enter admin password to continue</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {isVerifying ? 'Verifying...' : 'Access Admin Panel'}
              </button>
              
              <Link
                href="/"
                className="block w-full text-center bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated admin dashboard
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-x-hidden max-w-full">
      {/* Simple Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.814 3.051 10.892 7.747 14.14a.75.75 0 00.972 0 11.209 11.209 0 007.747-14.14.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">AnisAstro Admin Portal</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 overflow-x-hidden">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Welcome to Admin Dashboard</h1>
          <p className="text-indigo-200 text-lg">Manage your astrology platform efficiently</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Chats Card */}
          <Link href="/admin/chats">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-600 text-white mx-auto mb-4 group-hover:bg-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">User Chats</h3>
                <p className="text-indigo-200 text-sm">View and respond to user conversations</p>
              </div>
            </div>
          </Link>

          {/* Payments Card */}
          <div 
            onClick={() => {
              fetchPendingPayments();
              setShowPaymentDashboard(true);
            }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
          >
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-600 text-white mx-auto mb-4 group-hover:bg-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                  <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                  <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V8.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Payment Verification</h3>
              <p className="text-indigo-200 text-sm">Review and approve user payments</p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.432z" />
            </svg>
            Home
          </Link>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M19.28 8.47a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 11-1.06-1.06l.97-.97H9a.75.75 0 010-1.5h7.94l-.97-.97a.75.75 0 011.06-1.06l2.25 2.25z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Payment Dashboard Modal/Overlay */}
      {showPaymentDashboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
            {/* Payment Dashboard Header */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                      <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V8.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-white truncate">Payment Verification</span>
                </div>
                <button
                  onClick={() => setShowPaymentDashboard(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 010 1.06l-2.47 2.47H21a.75.75 0 010 1.5H4.81l2.47 2.47a.75.75 0 11-1.06 1.06L2.47 12.53a.75.75 0 010-1.06l3.75-3.75a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">Pending Payments</h2>
                <p className="text-indigo-200">Review and approve payment submissions</p>
              </div>

              {isLoading ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center text-white border border-white/20">
                  <p>Loading payments...</p>
                </div>
              ) : pendingPayments.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center text-white border border-white/20">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                  <p className="text-indigo-200">
                    No pending payments to review at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <div key={payment._id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Payment Info */}
                        <div className="text-white">
                          <h3 className="font-semibold text-lg mb-2">{payment.userEmail}</h3>
                          <div className="space-y-1 text-sm text-indigo-200">
                            <p><span className="font-medium">Category:</span> {payment.category}</p>
                            <p><span className="font-medium">Amount:</span> ₹{payment.amount}</p>
                            <p><span className="font-medium">Method:</span> {payment.paymentMethod}</p>
                            <p><span className="font-medium">Submitted:</span> {new Date(payment.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        {/* Question */}
                        <div className="text-white">
                          <p className="font-medium mb-2">User&apos;s Question:</p>
                          <div className="bg-white/5 rounded-lg p-3 text-indigo-200 text-sm">
                            &ldquo;{payment.question}&rdquo;
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => handlePaymentAction(payment._id, 'verify')}
                            disabled={processingId === payment._id}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                          >
                            {processingId === payment._id ? 'Processing...' : '✅ Verify Payment'}
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection (will be shown to user):');
                              if (reason && reason.trim()) {
                                handlePaymentAction(payment._id, 'reject', reason.trim());
                              }
                            }}
                            disabled={processingId === payment._id}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                          >
                            {processingId === payment._id ? 'Processing...' : '❌ Reject Payment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
