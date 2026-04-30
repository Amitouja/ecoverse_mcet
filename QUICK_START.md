# 🚀 EcoVerse Quick Start Guide

## Get Started in 5 Minutes

### 1️⃣ Install Dependencies
```bash
npm install
cd ecoverse-backend && npm install && cd ..
```

### 2️⃣ Setup Supabase Database

**Go to Supabase Console:**
1. https://supabase.com → Login
2. Create new project or select existing
3. Go to SQL Editor
4. Copy & run all SQL from `SUPABASE_SETUP.md`
5. Run the products INSERT query

### 3️⃣ Set Environment Variables

**.env.local** (Frontend)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**ecoverse-backend/.env** (Backend)
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
NODE_ENV=development
```

### 4️⃣ Start Servers

**Terminal 1:**
```bash
npm run dev
# Frontend: http://localhost:3000
```

**Terminal 2:**
```bash
cd ecoverse-backend
npm run dev
# Backend: http://localhost:5000
```

### 5️⃣ Test It Out

1. Go to http://localhost:3000
2. Sign up for account
3. Go to Shop
4. Add products to cart
5. Checkout with card: `4242 4242 4242 4242`
6. See order confirmation
7. Check eco-points in dashboard

---

## 📍 Key Pages

| Page | URL | What to do |
|------|-----|-----------|
| Sign Up | `/signup` | Create account |
| Sign In | `/login` | Log in |
| Shop | `/shop` | Browse products |
| Product | `/shop/products/1` | View details |
| Cart | `/cart` | Review items |
| Checkout | `/checkout` | Place order |
| Confirmation | `/order-confirmation/id` | See success |
| Dashboard | `/dashboard` | View profile |

---

## 🛒 User Flow

```
Sign Up 
  ↓
Browse Shop 
  ↓
Add to Cart 
  ↓
View Cart 
  ↓
Checkout (Shipping → Billing → Review)
  ↓
Place Order
  ↓
Order Confirmation
  ↓
Check Dashboard for Eco Points
```

---

## 🎨 What You Get

✅ Full authentication system
✅ Product browsing & filtering
✅ Shopping cart with persistence
✅ Multi-step checkout
✅ Order management
✅ Eco-points system
✅ Responsive design
✅ Backend APIs
✅ Database integration

---

## 🔐 Test Credentials

**Demo Payment Card:**
- Number: `4242 4242 4242 4242`
- Expiry: `12/25` (any future date)
- CVV: `123` (any 3 digits)

---

## ❓ Troubleshooting

### "Can't connect to Supabase"
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Verify API key is valid
- Ensure project is active

### "Cart not saving"
- Make sure you're logged in
- Check backend logs
- Verify products table has data

### "Checkout button disabled"
- Fill all required fields
- Check browser console for errors
- Verify backend is running

---

## 📚 Learn More

- See `IMPLEMENTATION_GUIDE.md` for full details
- Check `SUPABASE_SETUP.md` for database schema
- Review code comments in source files

---

## 🚢 Ready for Production?

1. Update SUPABASE_URL for production project
2. Configure payment gateway (Stripe/Razorpay)
3. Set up email notifications
4. Configure CDN for images
5. Deploy frontend to Vercel
6. Deploy backend to Heroku/Railway

---

**Happy Coding! 🌿**
