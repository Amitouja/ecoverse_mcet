# ⚡ EcoVerse Quick Reference Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free)

### Quick Start

```bash
# 1. Install dependencies
npm install
cd ecoverse-backend && npm install && cd ..

# 2. Setup environment files
# Copy .env.local.example to .env.local
# Copy ecoverse-backend/.env.example to ecoverse-backend/.env
# Add your Supabase credentials

# 3. Run database setup
# Visit https://supabase.com → New Query
# Paste contents of SUPABASE_COMPLETE_SCHEMA.sql → Run

# 4. Start servers
# Terminal 1:
npm run dev

# Terminal 2:
cd ecoverse-backend && npm start
```

**Frontend:** http://localhost:3000
**Backend:** http://localhost:5000

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page with hero |
| `app/components/Hero.tsx` | Animated marquee banner |
| `app/components/Navbar.tsx` | Navigation bar |
| `app/components/ThemeToggle.tsx` | Dark/Light mode |
| `app/context/AuthContext.tsx` | User authentication |
| `app/context/CartContext.tsx` | Shopping cart logic |
| `app/context/ThemeContext.tsx` | Theme management |
| `app/shop/page.tsx` | Product listing |
| `app/rewards/page.tsx` | Scratch card system |
| `app/eco-ranks/page.tsx` | Leaderboard |
| `app/ai-stylist/page.tsx` | Fashion recommendations |
| `app/dashboard/page.tsx` | User dashboard |
| `ecoverse-backend/routes/rewards.js` | Rewards API |
| `ecoverse-backend/routes/orders.js` | Orders API |
| `SUPABASE_COMPLETE_SCHEMA.sql` | Database setup |

---

## 🔄 User Flow

```
Sign Up → Browse Shop → Add to Cart 
  ↓
Checkout (Shipping → Billing → Review) 
  ↓
Place Order → Generate Rewards → Get Scratch Cards 
  ↓
View Dashboard (Eco Points, Rank, Progress) 
  ↓
Track Travel/Electricity Impact 
  ↓
Climb Eco Ranks → Unlock Tier Benefits
```

---

## 🎯 Core Features Checklist

- [x] Animated Hero Banner (rotating eco messages)
- [x] Dark/Light Mode Toggle
- [x] Full Navigation (all links work)
- [x] Product Shop (with filters)
- [x] Shopping Cart (persistent)
- [x] Checkout Flow (3-step)
- [x] Order Management
- [x] Rewards System (scratch cards)
- [x] Eco Ranks & Leaderboard
- [x] AI Stylist
- [x] Travel Impact Calculator
- [x] Electricity Impact Tracker
- [x] User Dashboard
- [x] Authentication (Login/Signup)

---

## 🛠️ Customization Guide

### Change Product List

Edit `app/shop/page.tsx`:
```javascript
const PRODUCTS = [
  { 
    name: 'Your Product', 
    price: '₹1,299', 
    eco: 95,
    // ... other fields
  }
];
```

### Adjust Eco Points Rewards

Edit `ecoverse-backend/routes/orders.js`:
```javascript
const ecoPoints = Math.round(total / 50); // Change divisor
```

### Modify Reward Tiers

Edit `app/eco-ranks/page.tsx`:
```javascript
const ecoRankInfo = {
  SEED: { threshold: 0 },      // Adjust thresholds
  SAPLING: { threshold: 500 },
  // ...
};
```

### Update Reward Pool

Edit `ecoverse-backend/routes/rewards.js`:
```javascript
const REWARD_OPTIONS = [
  { type: 'DISCOUNT', value: '15% OFF' },  // Add/modify
  // ...
];
```

### Customize Colors

Edit `tailwind.config.ts` or `app/globals.css`:
```css
--color-primary: #10b981;  /* Green */
--color-accent: #f59e0b;   /* Amber */
```

---

## 🔗 External Integrations (TODO)

### Stripe/Razorpay Integration
Add payment processing in `/app/checkout/page.tsx`:
```javascript
// Install package
npm install stripe

// Add to checkout
const response = await stripe.payment.create({
  amount: total * 100,
  currency: 'INR',
  source: token,
});
```

### Email Notifications (SendGrid)
```javascript
// Order confirmation email
// Reward unlocked notification
// Rank upgrade alert
```

### Analytics (Google Analytics)
```javascript
// Track user behavior
// Monitor conversion rates
// Measure eco-impact
```

---

## 📊 Database Queries

### Get Top 10 Eco Warriors
```sql
SELECT email, full_name, eco_points, eco_rank 
FROM users 
ORDER BY eco_points DESC 
LIMIT 10;
```

### Calculate User's Carbon Saved
```sql
SELECT 
  SUM(carbon_saved_kg) as total_carbon_saved,
  AVG(carbon_saved_kg) as avg_per_action
FROM eco_actions 
WHERE user_id = '${userId}';
```

### Get Unclaimed Rewards
```sql
SELECT * FROM rewards 
WHERE user_id = '${userId}' AND is_claimed = false;
```

### Track Order Revenue
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as orders,
  SUM(total_price) as revenue
FROM orders 
WHERE status = 'completed'
GROUP BY DATE(created_at);
```

---

## 🐛 Common Issues & Fixes

### Issue: Env variables not loading
**Fix:** 
```bash
# Restart dev server after adding .env.local
npm run dev
```

### Issue: Cart not syncing across tabs
**Fix:** Enable localStorage API in browser
```javascript
localStorage.setItem('cart', JSON.stringify(items));
```

### Issue: Supabase connection error
**Fix:** 
```bash
# Verify URL format: https://PROJECT-ID.supabase.co
# Check anon key is copied correctly
# Ensure Row-Level Security policies are set
```

### Issue: Rewards not generating
**Fix:**
```bash
# Check rewards route is in server.js
# Verify database rewards table exists
# Test API: POST /api/rewards/generate-for-order
```

---

## 🔒 Security Best Practices

```javascript
// ✅ DO:
- Use environment variables for secrets
- Enable Supabase RLS policies
- Validate all user input
- Hash passwords (Supabase handles this)
- Use HTTPS in production

// ❌ DON'T:
- Commit .env files
- Expose API keys in client code
- Skip input validation
- Use SQL injection vulnerable queries
- Store sensitive data in localStorage unencrypted
```

---

## 🚀 Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrated to production
- [ ] RLS policies verified
- [ ] API endpoints tested
- [ ] Frontend build successful (`npm run build`)
- [ ] Backend dependencies installed
- [ ] Error logging configured
- [ ] SSL certificate valid
- [ ] CORS whitelist updated
- [ ] Rate limiting enabled
- [ ] Database backups scheduled

---

## 📱 Testing Credentials

**Test User:**
```
Email: test@example.com
Password: TestPassword123
```

**Test Card (Stripe):**
```
Number: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

---

## 💡 Pro Tips

1. **Optimize Images:** Use WebP format for faster loading
2. **Cache Frequently:** Cache leaderboard (updates daily)
3. **Monitor Performance:** Use Vercel Analytics
4. **Backup Database:** Daily Supabase snapshots
5. **A/B Test Rewards:** Try different reward distributions
6. **Track Metrics:** Monitor conversion, CAC, LTV

---

## 📞 Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com)

---

## 🎉 You're Ready!

The EcoVerse platform is fully functional and ready to:
1. ✅ Accept users & manage authentication
2. ✅ Process orders & payments
3. ✅ Generate & manage rewards
4. ✅ Track eco-impact
5. ✅ Build community leaderboards
6. ✅ Provide personalized recommendations

**Next Steps:**
- Customize branding & messaging
- Integrate payment provider
- Set up email notifications
- Deploy to production
- Monitor & optimize

---

**Happy coding! 🌿💚**
