import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    placeOfBirth: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    paidCategories: [{
      type: String,
      enum: ['Love', 'Life', 'Career', 'Partner', 'Future'],
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
// Note: email index is automatically created by unique: true
UserSchema.index({ paidCategories: 1 });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
