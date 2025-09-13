import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
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
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'astrologer', 'ai'],
      default: 'user',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
MessageSchema.index({ userEmail: 1, category: 1, createdAt: -1 });
MessageSchema.index({ userEmail: 1, createdAt: -1 });
MessageSchema.index({ category: 1, createdAt: -1 });

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
