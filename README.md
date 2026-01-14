GigFlow - TypeScript MERN Freelance Marketplace 🚀
A full-stack TypeScript MERN application for freelance marketplace with real-time notifications, MongoDB transactions, and secure authentication.
🎯 Live Demo

Frontend: https://server-hive.vercel.app
Backend API: https://gigflow-backend-mfo1.onrender.com

✨ Features
Core Features

🔐 Secure Authentication - JWT-based auth with HttpOnly cookies
👥 Dual Role System - Users can be both clients and freelancers
💼 Gig Management - Full CRUD operations for job postings
💰 Bidding System - Freelancers can submit proposals on open gigs
🔔 Real-time Notifications - Socket.io powered instant updates
🔒 MongoDB Transactions - Atomic operations to prevent race conditions
🔍 Search & Filter - Find gigs by title, description, or status
📱 Responsive Design - Works on desktop, tablet, and mobile

Technical Features

✅ 100% TypeScript - Full type safety on frontend and backend
✅ Redux Toolkit - Centralized state management with typed slices
✅ Type-safe API - Axios with typed responses
✅ Real-time Updates - Socket.io with typed events
✅ Production Ready - Deployed on Vercel & Render
✅ Professional UI - Tailwind CSS with smooth animations

🛠 Tech Stack
Backend

Runtime: Node.js with TypeScript
Framework: Express.js
Database: MongoDB with Mongoose
Authentication: JWT + bcryptjs
Real-time: Socket.io
Validation: express-validator
Security: CORS, cookie-parser, HttpOnly cookies

Frontend

Framework: React 18 with TypeScript
Build Tool: Vite
State Management: Redux Toolkit
Routing: React Router v6
Styling: Tailwind CSS
HTTP Client: Axios
Notifications: React Hot Toast
Icons: Lucide React

📦 Project Structure
gigflow-typescript/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Authentication logic
│   │   │   ├── gigController.ts      # Gig CRUD operations
│   │   │   └── bidController.ts      # Bidding & hiring logic
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   └── error.ts              # Error handling
│   │   ├── models/
│   │   │   ├── User.ts               # User schema
│   │   │   ├── Gig.ts                # Gig schema
│   │   │   └── Bid.ts                # Bid schema
│   │   ├── routes/
│   │   │   ├── auth.ts               # Auth routes
│   │   │   ├── gigs.ts               # Gig routes
│   │   │   └── bids.ts               # Bid routes
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript types
│   │   └── server.ts                 # Express + Socket.io setup
│   ├── dist/                         # Compiled JavaScript
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx            # Navigation component
    │   │   ├── GigCard.tsx           # Gig display card
    │   │   └── PrivateRoute.tsx      # Protected route wrapper
    │   ├── pages/
    │   │   ├── Home.tsx              # Landing page
    │   │   ├── Login.tsx             # Login page
    │   │   ├── Register.tsx          # Registration page
    │   │   ├── Dashboard.tsx         # Browse gigs
    │   │   ├── GigDetails.tsx        # Gig details & bidding
    │   │   ├── CreateGig.tsx         # Post new gig
    │   │   ├── MyGigs.tsx            # User's posted gigs
    │   │   └── MyBids.tsx            # User's submitted bids
    │   ├── store/
    │   │   ├── store.ts              # Redux store config
    │   │   ├── hooks.ts              # Typed Redux hooks
    │   │   └── slices/
    │   │       ├── authSlice.ts      # Auth state
    │   │       ├── gigsSlice.ts      # Gigs state
    │   │       └── bidsSlice.ts      # Bids state
    │   ├── types/
    │   │   └── index.ts              # Frontend types
    │   ├── utils/
    │   │   ├── api.ts                # Axios config
    │   │   └── socket.ts             # Socket.io client
    │   ├── App.tsx                   # Main app component
    │   ├── main.tsx                  # Entry point
    │   └── index.css                 # Global styles
    ├── tsconfig.json
    └── package.json
🚀 Getting Started
Prerequisites

Node.js v18+
MongoDB (local or Atlas)
npm or yarn

Backend Setup
bash# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env


MONGODB_URI=mongodb+srv://apoorvapratapsingh6_db_user:KiCwjdF0wfBk0j3a@cluster0.hn3epp7.mongodb.net/
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
COOKIE_EXPIRE=7

# Compile TypeScript
npm run build

# Run development server (with hot reload)
npm run dev

# Or run production build
npm start
Frontend Setup
bash# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Run development server
npm run dev

# Build for production
npm run build
```

### Access the Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/me           # Get current user (Protected)
POST   /api/auth/logout       # Logout user (Protected)
```

### Gig Endpoints
```
GET    /api/gigs                    # Get all gigs (with search/filter)
GET    /api/gigs/:id                # Get single gig
POST   /api/gigs                    # Create gig (Protected)
PUT    /api/gigs/:id                # Update gig (Protected, Owner only)
DELETE /api/gigs/:id                # Delete gig (Protected, Owner only)
GET    /api/gigs/my/posted          # Get user's posted gigs (Protected)
```

### Bid Endpoints
```
POST   /api/bids                    # Submit bid (Protected)
GET    /api/bids/:gigId             # Get bids for gig (Protected, Owner only)
GET    /api/bids/my/submitted       # Get user's submitted bids (Protected)
PATCH  /api/bids/:bidId/hire        # Hire freelancer (Protected, Owner only)
PUT    /api/bids/:bidId             # Update bid (Protected, Bid owner only)
DELETE /api/bids/:bidId             # Delete bid (Protected, Bid owner only)
🔐 Authentication Flow

User registers/logs in
Backend generates JWT token
Token stored in HttpOnly cookie (XSS protection)
Token sent with every request
Backend verifies token in protected routes
User data cached in Redux store

💾 MongoDB Transactions (Race Condition Prevention)
When hiring a freelancer, the app uses MongoDB transactions to ensure atomicity:
typescriptconst session = await mongoose.startSession();
session.startTransaction();

try {
  // 1. Update hired bid to 'hired'
  await Bid.findByIdAndUpdate(bidId, { status: 'hired' }, { session });
  
  // 2. Update gig to 'assigned'
  await Gig.findByIdAndUpdate(gigId, { status: 'assigned', hiredBidId: bidId }, { session });
  
  // 3. Reject all other pending bids
  await Bid.updateMany({ gigId, _id: { $ne: bidId }, status: 'pending' }, { status: 'rejected' }, { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
Why this matters: Prevents two gig owners from hiring different freelancers simultaneously for the same gig.
🔔 Real-time Notifications
Socket.io implementation:
Backend:
typescript// Emit to specific user when hired
io.to(freelancerId).emit('bid-hired', {
  bidId: bid._id,
  gigId: gig._id,
  gigTitle: gig.title,
  message: `You have been hired for "${gig.title}"`
});
Frontend:
typescript// Listen for notifications
socket.on('bid-hired', (data: BidHiredEvent) => {
  toast.success(` ${data.message}`);
});
🎨 Key TypeScript Features
Typed Redux Slices
typescriptexport const login = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, thunkAPI) => {
    const response = await api.post<{ success: boolean; user: User }>('/auth/login', credentials);
    return response.data.user;
  }
);
Typed API Calls
typescriptconst response = await api.post<{ success: boolean; user: User }>(
  '/auth/register',
  userData
);
// response.data.user is fully typed!
Typed Component Props
typescriptinterface GigCardProps {
  gig: Gig;
}

const GigCard: React.FC<GigCardProps> = ({ gig }) => {
  // gig is fully typed with autocomplete
};
```

## 🚀 Deployment

### Deploy Backend to Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variables
5. Deploy!

### Deploy Frontend to Vercel

1. Import project on Vercel
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variables:
```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_SOCKET_URL=https://your-backend.onrender.com

Deploy!

Update Backend CORS
After frontend deployment, update backend's CLIENT_URL environment variable to your Vercel URL.
🧪 Testing the Application
Test Authentication

Register a new user
Login with credentials
Verify JWT cookie is set
Navigate to protected routes

Test Gig Creation

Login as User A
Create a new gig
Verify gig appears in "My Gigs"
Logout and login as User B
User B should not see User A's private data

Test Bidding System

Login as User A (Client)
Post a gig
Logout and login as User B (Freelancer)
Submit a bid on the gig
Logout and login as User A
View bids and hire User B
Verify real-time notification is received by User B

Test Race Conditions

Login as User A
Post a gig
Have User B and User C submit bids
Open two browser tabs as User A
Try to hire both User B and User C simultaneously
Only one should succeed (MongoDB transactions prevent double-hiring)

🐛 Common Issues & Solutions
Issue: CORS Error
Solution: Ensure CLIENT_URL in backend matches your frontend URL exactly (no trailing slash)
Issue: MongoDB Connection Failed
Solution: Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access
Issue: Cookies Not Being Sent
Solution: Make sure withCredentials: true in axios and sameSite: 'none' in production
Issue: TypeScript Compilation Errors
Solution: Run npm install --save-dev @types/express @types/node etc.
Issue: Render Backend Sleeping
Solution: Free tier sleeps after 15min inactivity. First request takes 30-60 seconds.
📊 Performance Optimizations

✅ MongoDB indexes on frequently queried fields
✅ Lazy loading for routes (code splitting)
✅ Redux state persistence for faster loads
✅ Optimized bundle size with Vite
✅ Efficient Socket.io event handling

🔒 Security Features

✅ Password hashing with bcrypt (10 salt rounds)
✅ JWT tokens in HttpOnly cookies (prevents XSS)
✅ SameSite cookie attribute (prevents CSRF)
✅ Input validation on all endpoints
✅ Protected routes with authentication middleware
✅ CORS configuration for trusted origins only

🎓 Learning Outcomes
This project demonstrates:

Full-stack TypeScript development
RESTful API design
Real-time communication with WebSockets
State management with Redux Toolkit
Database transactions for data integrity
Secure authentication implementation
Modern React patterns (hooks, context)
Deployment to production platforms

📝 License
MIT License - feel free to use this project for learning or portfolio purposes!
👤 Author
Aps
Full Stack TypeScript Developer
MERN Stack Expert
🙏 Acknowledgments

Anthropic's Claude for development assistance
MongoDB for excellent documentation
Vercel and Render for free hosting tiers
The React and TypeScript communities

📧 Contact
For questions or feedback, feel free to reach out!

⭐ If you found this project helpful, please give it a star!Claude is AI and can make mistakes. Please double-check responses.