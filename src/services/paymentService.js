import dbConnect from '@/lib/db/mongoose';
import { PaymentVerification } from '@/models/PaymentVerification';
import { updateUserPaidCategories } from './userService';

export async function createPaymentVerification(paymentData) {
  await dbConnect();
  
  const payment = new PaymentVerification({
    userEmail: paymentData.userEmail.toLowerCase().trim(),
    category: paymentData.category,
    amount: paymentData.amount || 10,
    question: paymentData.question.trim(),
    paymentMethod: paymentData.paymentMethod || 'manual',
    transactionId: paymentData.transactionId?.trim() || '',
    status: 'pending',
  });
  
  return await payment.save();
}

export async function verifyPayment(paymentId, verifierEmail = 'admin') {
  await dbConnect();
  
  const payment = await PaymentVerification.findByIdAndUpdate(
    paymentId,
    {
      status: 'verified',
      verifiedAt: new Date(),
      verifiedBy: verifierEmail,
    },
    { new: true }
  );
  
  if (payment) {
    // Add category to user's paid categories
    await updateUserPaidCategories(payment.userEmail, payment.category);
  }
  
  return payment;
}

export async function rejectPayment(paymentId, reason, verifierEmail = 'admin') {
  await dbConnect();
  
  return await PaymentVerification.findByIdAndUpdate(
    paymentId,
    {
      status: 'rejected',
      verifiedAt: new Date(),
      verifiedBy: verifierEmail,
      adminNotes: reason,
    },
    { new: true }
  );
}

export async function getPendingPayments(limit = 50) {
  await dbConnect();
  
  return await PaymentVerification.find({ status: 'pending' })
    .select('-__v')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getUserPayments(email) {
  await dbConnect();
  
  return await PaymentVerification.find({
    userEmail: email.toLowerCase().trim(),
  })
    .select('-__v')
    .sort({ createdAt: -1 })
    .lean();
}

export async function getUserPaymentStatus(email, category) {
  await dbConnect();
  
  return await PaymentVerification.findOne({
    userEmail: email.toLowerCase().trim(),
    category: category,
  })
    .select('status verifiedAt createdAt')
    .sort({ createdAt: -1 })
    .lean();
}
