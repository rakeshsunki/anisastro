import dbConnect from '@/lib/db/mongoose';
import { User } from '@/models/User';

export async function createUser(userData) {
  await dbConnect();
  
  const user = new User({
    email: userData.email.toLowerCase().trim(),
    name: userData.name.trim(),
    dob: new Date(userData.dob),
    placeOfBirth: userData.placeOfBirth.trim(),
    phone: userData.phone?.trim() || '',
    paidCategories: [],
  });
  
  return await user.save();
}

export async function getUserByEmail(email) {
  await dbConnect();
  return await User.findOne({ 
    email: email.toLowerCase().trim(),
    isActive: true 
  }).lean();
}

export async function updateUserPaidCategories(email, category) {
  await dbConnect();
  
  return await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { $addToSet: { paidCategories: category } },
    { new: true, upsert: false }
  ).lean();
}

export async function getUserPaidCategories(email) {
  await dbConnect();
  
  const user = await User.findOne(
    { email: email.toLowerCase().trim() },
    { paidCategories: 1, _id: 0 }
  ).lean();
  
  return user?.paidCategories || [];
}

export async function getAllUsers(limit = 50, skip = 0) {
  await dbConnect();
  
  return await User.find({ isActive: true })
    .select('-__v')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
}

export async function deleteUser(email) {
  await dbConnect();
  
  return await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { isActive: false },
    { new: true }
  );
}
