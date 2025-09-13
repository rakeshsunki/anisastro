"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
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
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.814 3.051 10.892 7.747 14.14a.75.75 0 00.972 0 11.209 11.209 0 007.747-14.14.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">AnisAstro Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/chats"
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Chat Inbox
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
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Payment Verification Dashboard</h2>
          <p className="text-indigo-200">Review and approve pending payment submissions</p>
        </div>

        {pendingPayments.length === 0 ? (
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
  );
}
