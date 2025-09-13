import mongoose from 'mongoose';

const PaymentVerificationSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Love', 'Life', 'Career', 'Partner', 'Future'],
    },
    amount: {
      type: Number,
      required: true,
      default: 10,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'manual', 'razorpay'],
      default: 'manual',
    },
    question: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PaymentVerificationSchema.index({ userEmail: 1, category: 1 });
PaymentVerificationSchema.index({ status: 1, createdAt: -1 });
PaymentVerificationSchema.index({ transactionId: 1 });

export const PaymentVerification = mongoose.models.PaymentVerification || 
  mongoose.model('PaymentVerification', PaymentVerificationSchema);
