# AnisAstro - Astrology Chat Platform

## Database Setup

This project uses MongoDB with Mongoose for data persistence.

### Environment Setup

1. **Install MongoDB** (choose one):

   - **Local MongoDB**: Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud): Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)

2. **Configure Environment Variables**:

   Copy and edit `.env.local`:

   ```bash
   # Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/anisastro

   # OR MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anisastro
   ```

3. **Install Dependencies**:
   ```bash
   npm install mongoose
   ```

### Database Schema

The application uses three main collections:

#### Users Collection

```javascript
{
  email: String (unique),
  name: String,
  dob: Date,
  placeOfBirth: String,
  phone: String (optional),
  paidCategories: [String], // ['Love', 'Career', etc.]
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Messages Collection

```javascript
{
  userEmail: String,
  category: String, // 'Love', 'Life', 'Career', 'Partner', 'Future'
  text: String,
  role: String, // 'user', 'astrologer', 'ai'
  isRead: Boolean,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### PaymentVerification Collection

```javascript
{
  userEmail: String,
  category: String,
  amount: Number (default: 10),
  status: String, // 'pending', 'verified', 'rejected', 'refunded'
  paymentMethod: String, // 'upi', 'manual', 'razorpay'
  question: String,
  transactionId: String,
  adminNotes: String,
  verifiedAt: Date,
  verifiedBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### User Management

- `POST /api/users` - Create new user
- `POST /api/user/chats` - Check if user exists
- `GET /api/user/chats/[email]` - Get user's chat history

#### Messaging

- `POST /api/user/chats/send` - Send message

#### Payment Management

- `POST /api/payment/process` - Submit payment for verification
- `GET /api/admin/payments` - Get pending payments (admin)
- `POST /api/admin/payments` - Verify/reject payments (admin)

### Running the Application

1. **Start MongoDB** (if using local installation)
2. **Start the application**:
   ```bash
   npm run dev
   ```
3. **Access admin panel**: Visit `/admin` to verify payments

### User Flow

1. **Registration**: User fills form → Creates user in database
2. **Category Selection**: User selects astrology category
3. **Payment**: User asks question → Submits ₹10 payment → Creates payment verification record
4. **Admin Verification**: Admin verifies payment via `/admin` → Unlocks category access
5. **Chat Access**: User can chat in verified categories

### Development Notes

- All database operations are in `/src/services/` directory
- Models are defined in `/src/models/` directory
- Database connection utility is in `/src/lib/db/mongoose.js`
- The app automatically creates indexes for better performance

### Production Deployment

1. Set up MongoDB Atlas cluster
2. Update `MONGODB_URI` in production environment
3. Ensure proper error handling and logging
4. Consider implementing rate limiting for API routes
5. Add authentication for admin routes
