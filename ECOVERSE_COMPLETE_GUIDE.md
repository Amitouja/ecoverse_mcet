# 🌱 EcoVerse - Complete Implementation Guide

## 📋 Table of Contents
1. [Project Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup)
4. [Database Schema](#database)
5. [Features & Implementation](#features)
6. [API Documentation](#api)
7. [Deployment](#deployment)

---

## 🎯 Project Overview <a name="overview"></a>

**EcoVerse** is a full-stack web application designed to reward users for eco-friendly actions and purchases. The platform incentivizes sustainability through:

- ✨ Real-world rewards (GPay scratch cards, cashback, discounts)
- 📊 Carbon footprint tracking
- 🏆 Eco ranks & global leaderboard
- 🎁 Gamified rewards system
- 🤖 AI-powered fashion recommendations
- 💚 Community impact tracking

### Key Concepts

**Carbon Emission System:**
- Companies have carbon emission limits (caps set by governments)
- Exceeding limits → Penalties/fines
- EcoVerse bridges sustainability: Users earn rewards, companies buy carbon credits
- Users' eco-actions contribute to company sustainability goals

---

## 🏗️ Architecture <a name="architecture"></a>

### Tech Stack
```
Frontend:
  - Next.js 16+ (React 19)
  - TypeScript
  - Tailwind CSS 4
  - Recharts (Data visualization)

Backend:
  - Node.js + Express
  - Supabase (Auth & Database)
  - Python (ML Services)

Database:
  - PostgreSQL (Supabase)
  - Row-Level Security (RLS) enabled
```

### Project Structure
```
f:\app\
├── app/
│   ├── components/        # React components
│   ├── context/           # Auth, Cart, Theme contexts
│   ├── lib/               # Supabase client
│   ├── api/               # API routes
│   ├── shop/              # Shop pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout flow
│   ├── dashboard/         # User dashboard
│   ├── rewards/           # Rewards system
│   ├── eco-ranks/         # Leaderboard
│   ├── ai-stylist/        # Fashion recommendations
│   ├── travel/            # Travel impact tracker
│   ├── electricity/       # Energy tracker
│   ├── login/signup/      # Auth pages
│   ├── layout.tsx         # Main layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── ecoverse-backend/
│   ├── server.js          # Express server
│   ├── routes/            # API routes
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── rewards.js
│   │   ├── travel.js
│   │   ├── electricity.js
│   │   └── ml-predictions.js
│   └── ml-service/        # Python ML models
├── SUPABASE_COMPLETE_SCHEMA.sql  # Complete DB schema
└── package.json           # Dependencies
```

---

## 🚀 Setup Instructions <a name="setup"></a>

### Step 1: Clone & Install Dependencies

```bash
# Navigate to project
cd f:\app

# Install frontend dependencies
npm install

# Install backend dependencies
cd ecoverse-backend
npm install
cd ..
```

### Step 2: Set Up Supabase

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Click "New Project"
   - Enter project name: `ecoverse-tracker`
   - Create database password
   - Choose region closest to you

2. **Get Credentials:**
   - After project creation, go to **Settings → API**
   - Copy:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon` (public) key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_KEY` (backend)

3. **Create Database Tables:**
   - Go to Supabase → **SQL Editor**
   - Click **New Query**
   - Copy ALL SQL from `SUPABASE_COMPLETE_SCHEMA.sql`
   - Click **Run**

### Step 3: Create Environment Files

**`.env.local` (Frontend)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**`ecoverse-backend/.env` (Backend)**
```bash
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-service-role-key-here
NODE_ENV=development
```

### Step 4: Start Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd ecoverse-backend
npm start
# Runs on http://localhost:5000
```

---

## 📊 Database Schema <a name="database"></a>

### Main Tables

#### `users`
```sql
- id (UUID): User's Supabase auth ID
- email (TEXT): Unique email
- full_name (TEXT): User's name
- eco_points (INTEGER): Eco points earned
- carbon_footprint (FLOAT): Total CO₂ tracked
- eco_rank (TEXT): SEED | SAPLING | TREE | FOREST_GUARDIAN
- created_at (TIMESTAMP): Account creation date
```

#### `products`
```sql
- id (SERIAL): Product ID
- name (TEXT): Product name
- price (FLOAT): Price in INR
- eco_score (INTEGER): 0-100 eco rating
- tag (TEXT): ORGANIC | RECYCLED | VEGAN
- material (TEXT): Material description
- eco_points_reward (INTEGER): Points for purchase
- stock (INTEGER): Available quantity
```

#### `orders`
```sql
- id (UUID): Order ID
- user_id (UUID): Buyer's ID
- items (JSONB): Cart items array
- total_price (FLOAT): Order total
- status (TEXT): PENDING | COMPLETED | CANCELLED
- eco_points_earned (INTEGER): Points gained
- shipping_address (JSONB): Delivery address
- created_at (TIMESTAMP): Order date
```

#### `rewards`
```sql
- id (UUID): Reward ID
- user_id (UUID): User who earned reward
- order_id (UUID): Associated order (optional)
- reward_type (TEXT): DISCOUNT | CASHBACK | POINTS | COUPON | GIFT
- reward_value (TEXT): Display text (e.g., "10% OFF")
- reward_amount (FLOAT): Monetary value
- is_claimed (BOOLEAN): Claimed status
- created_at (TIMESTAMP): Earned date
- claimed_at (TIMESTAMP): Claim date
```

#### `eco_actions`
```sql
- id (UUID): Action ID
- user_id (UUID): User who performed action
- action_type (TEXT): TRAVEL | ELECTRICITY | CHALLENGE | PURCHASE
- distance (FLOAT): Distance (km) for travel
- carbon_saved (FLOAT): CO₂ saved (kg)
- points_earned (INTEGER): Points for action
- created_at (TIMESTAMP): Action date
```

#### `carbon_footprint`
```sql
- id (UUID): Record ID
- user_id (UUID): User
- category (TEXT): TRAVEL | ELECTRICITY | SHOPPING | OTHER
- carbon_kg (FLOAT): CO₂ emitted
- carbon_saved_kg (FLOAT): CO₂ offset
- description (TEXT): Activity details
- created_at (TIMESTAMP): Record date
```

---

## ✨ Features & Implementation <a name="features"></a>

### 1. 🛒 Shop System

**Components:**
- `app/components/Shop.tsx` - Product listing with filters
- `app/shop/page.tsx` - Shop page
- `app/shop/products/[id]/page.tsx` - Product details

**Features:**
- Filter by: All, Organic, Recycled, Vegan
- Add to cart → CartContext stores locally & in DB
- Product eco-scores displayed
- One-click purchase → instant eco points

**Backend:** `ecoverse-backend/routes/cart.js`

---

### 2. 🎁 Rewards System

**Components:**
- `app/rewards/page.tsx` - Interactive scratch cards
- `app/components/ScratchCard.tsx` - Canvas-based scratch effect

**Features:**
- After purchase: Generate 1-3 random rewards
- Scratch card UI - 30% scratch threshold to reveal
- Reward types:
  - 💰 CASHBACK (₹25-₹100)
  - 🏷️ DISCOUNT (5%-20% OFF)
  - ⭐ POINTS (2x or 1.5x)
  - 🎟️ COUPON (Free Shipping, Store Credit)
  - 🎁 GIFT (Plant Tree, VIP Access)

**Reward Generation:**
```javascript
// Random selection from 12 options
generateRandomReward() → reward object
// Triggered on:
// - Order completion (1-3 rewards)
// - Eco action (50% chance)
// - Special promotions
```

**Backend:** `ecoverse-backend/routes/rewards.js`

---

### 3. 🏆 Eco Ranks System

**Components:**
- `app/eco-ranks/page.tsx` - Global leaderboard
- Rank display with emojis

**Rank Tiers:**
| Rank | Emoji | Points | Benefits |
|------|-------|--------|----------|
| 🌱 SEED | 🌱 | 0-499 | +5% bonus points |
| 🌿 SAPLING | 🌿 | 500-1,499 | Free eco-packaging |
| 🌳 TREE | 🌳 | 1,500-4,999 | Priority scratch cards |
| 🌍 FOREST GUARDIAN | 🌍 | 5,000+ | 20% off + exclusive drops |

**Features:**
- Live global leaderboard (top 100)
- User's current rank with progress
- Automatic rank update on points change
- Reward tiers visualization

**Database:** Auto-calculated via `calculate_eco_rank()` trigger

---

### 4. 🤖 AI Stylist

**Components:**
- `app/ai-stylist/page.tsx` - Recommendation engine

**Features:**
- Select style: Casual, Formal, Athletic, Bohemian, Minimalist
- Select occasion: Daily, Office, Party, Gym, Weekend
- Get 4 personalized eco-fashion recommendations
- Shows:
  - Product image & eco-score
  - Material & sustainability info
  - Why recommended (AI reasoning)
  - Price & CTA to purchase

**Future Enhancement:** Connect to ML service for real AI predictions

---

### 5. ✈️ Travel Impact Tracker

**Location:** `app/travel/page.tsx`

**Carbon Calculation Factors:**
```javascript
- Flight: 0.25 kg CO₂/km
- Car: 0.12 kg CO₂/km
- Train: 0.04 kg CO₂/km (most eco-friendly)
- Bus: 0.08 kg CO₂/km
```

**Features:**
- Input: Transport type, distance, passengers
- Calculate CO₂ per person
- Track monthly/yearly impact
- Suggest lower-carbon alternatives
- Earn points for using eco-transport

---

### 6. ⚡ Electricity Impact Tracker

**Location:** `app/electricity/page.tsx`

**Carbon Calculation:**
```javascript
- Grid electricity: 0.4 kg CO₂/kWh (coal-heavy)
- Mixed sources: 0.2 kg CO₂/kWh
- Renewable: 0.02 kg CO₂/kWh (solar/wind)
```

**Features:**
- Input: Monthly usage (kWh), energy source
- Calculate annual carbon footprint
- Compare with household average
- Tips for energy savings
- Earn points for switching to renewables

---

### 7. 💚 Hero with Animated Marquee

**Component:** `app/components/Hero.tsx`

**Features:**
- Rotating eco-messages every 4 seconds:
  - "🌱 Sustainable is the new luxury"
  - "💚 Earn while saving the planet"
  - "♻️ Every purchase makes a difference"
  - "🌍 Fashion with a conscience"
  - etc.
- Smooth fade-in/fade-out transitions
- Eye-catching gradient backgrounds

---

### 8. 🌗 Dark/Light Mode

**Components:**
- `app/context/ThemeContext.tsx` - Theme provider
- `app/components/ThemeToggle.tsx` - Toggle button

**Features:**
- Persistent theme preference (localStorage)
- System preference detection on first load
- Smooth color transitions
- Applied to all components with `dark:` classes

**Usage:**
```tsx
import { useTheme } from '@/app/context/ThemeContext';

export function MyComponent() {
  const { isDark, toggleTheme } = useTheme();
  // dark: isDark is true
  // Apply dark: prefixed Tailwind classes
}
```

---

## 📡 API Documentation <a name="api"></a>

### Base URLs
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Supabase REST API: `https://your-project-id.supabase.co/rest/v1`

### Authentication Endpoints

#### Sign Up
```bash
POST /api/auth/signup
{
  email: "user@example.com",
  password: "secure-password",
  name: "User Name"
}
```

#### Sign In
```bash
POST /api/auth/signin
{
  email: "user@example.com",
  password: "secure-password"
}
```

#### Sign Out
```bash
POST /api/auth/signout
# Requires auth token in header
```

### Orders Endpoints

#### Create Order
```bash
POST /api/orders/create
{
  userId: "uuid",
  items: [...],
  total: 5000,
  shippingAddress: {...},
  billingAddress: {...}
}

Response:
{
  success: true,
  data: {order object},
  ecoPointsEarned: 100
}
```

#### Get User Orders
```bash
GET /api/orders/user/:userId
```

### Rewards Endpoints

#### Generate Rewards for Order
```bash
POST /api/rewards/generate-for-order
{
  userId: "uuid",
  orderId: "uuid",
  ecoPointsEarned: 100
}
```

#### Get User Rewards
```bash
GET /api/rewards/user/:userId
```

#### Claim Reward
```bash
POST /api/rewards/:rewardId/claim
```

#### Get Reward Stats
```bash
GET /api/rewards/user/:userId/stats
```

### Travel Endpoints

#### Log Travel Activity
```bash
POST /api/travel/log
{
  userId: "uuid",
  transportType: "train",
  distance: 50,
  passengers: 1
}
```

### Electricity Endpoints

#### Log Electricity Usage
```bash
POST /api/electricity/log
{
  userId: "uuid",
  monthlyUsage: 150,
  energySource: "renewable"
}
```

---

## 🌐 Deployment <a name="deployment"></a>

### Deploy Frontend (Vercel)

```bash
# 1. Connect to Vercel
npm install -g vercel
vercel

# 2. Set environment variables in Vercel dashboard
# Add same .env.local values

# 3. Deploy
vercel --prod
```

### Deploy Backend (Railway/Heroku/Render)

**Option 1: Railway**
```bash
# 1. Install Railway CLI
npm install -g railway

# 2. Login & deploy
railway login
railway up
```

**Option 2: Render**
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy automatically

### Database Backups

```bash
# Supabase handles backups automatically
# Access in Supabase dashboard:
# Settings → Database → Backups
```

---

## 🔐 Security Checklist

- ✅ Supabase Row-Level Security (RLS) enabled
- ✅ Environment variables never committed to repo
- ✅ Authentication tokens stored securely
- ✅ Payment data (Stripe/Razorpay integration needed)
- ✅ CORS configured for production domains
- ✅ Rate limiting on API endpoints
- ✅ Input validation on all forms

---

## 📈 Performance Optimization

```javascript
// Frontend:
- Image optimization with Next.js Image component
- CSS minification (Tailwind)
- Code splitting with dynamic imports
- ISR (Incremental Static Regeneration)

// Backend:
- Database indexing on frequent queries
- Caching with Redis (optional)
- Query optimization
- Connection pooling

// Database:
- RLS policies for security
- Indexes on user_id, created_at
- JSONB fields for flexible data
```

---

## 🐛 Troubleshooting

### Issue: "Supabase connection failed"
**Solution:** Check environment variables are set correctly in `.env.local`

### Issue: "Cart items not persisting"
**Solution:** Ensure CartProvider wraps app. Check browser localStorage.

### Issue: "Rewards not generating"
**Solution:** Verify rewards.js route is added to server.js

### Issue: "Dark mode not working"
**Solution:** Check ThemeProvider wraps entire app in layout.tsx

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error logs in browser console
3. Check Supabase dashboard for database errors
4. Check backend terminal for API errors

---

## 🎉 Next Steps

1. ✅ **Complete Setup:** Follow installation steps above
2. ✅ **Test Features:** Sign up, shop, earn rewards
3. ✅ **Integrate Payments:** Add Stripe/Razorpay
4. ✅ **Deploy:** Push to Vercel + Railway
5. ✅ **Monitor:** Set up error tracking (Sentry)
6. ✅ **Scale:** Add caching, optimize queries

---

## 📄 License

EcoVerse © 2025 - Eco-Friendly E-commerce Platform

---

**Last Updated:** April 2025
**Version:** 1.0.0
