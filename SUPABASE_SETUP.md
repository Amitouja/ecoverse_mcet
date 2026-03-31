# Supabase Setup Guide for Ecoverse Tracker

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Enter project details:
   - Name: "ecoverse-tracker" (or your choice)
   - Database Password: Create a strong password
   - Region: Choose closest to your location
4. Click "Create new project" (Wait 2-3 minutes for setup)

## Step 2: Get Your Credentials

1. After project is created, go to **Settings** → **API**
2. Copy these values:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon` (public) key → NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Keep these safe!

## Step 3: Update .env.local

Open `f:\app\.env.local` and replace with your actual values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL code and run it:

```sql
-- Create footprints table
CREATE TABLE footprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'guest',
  type TEXT NOT NULL CHECK (type IN ('travel', 'electricity')),
  
  -- For travel records
  transport_type TEXT,
  distance FLOAT,
  
  -- For electricity records
  energy_source TEXT,
  monthly_usage FLOAT,
  
  -- Carbon data
  carbon_footprint FLOAT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_footprints_user_id ON footprints(user_id);
CREATE INDEX idx_footprints_type ON footprints(type);
CREATE INDEX idx_footprints_created_at ON footprints(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE footprints ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and write (adjust this for production)
CREATE POLICY "Allow all operations on footprints"
ON footprints
FOR ALL
USING (true)
WITH CHECK (true);
```

## Step 5: Verify Table Creation

1. Go to **Table Editor** in Supabase
2. You should see the `footprints` table with all columns

## Step 6: Test the Setup

Run this in your terminal to test the connection:

```bash
npm run dev
```

Then open the browser console and try:

```javascript
import { calculateTravelImpact } from '@/src/api/travel';
import { calculateElectricityImpact } from '@/src/api/electricity';

// Test travel impact
const travelResult = await calculateTravelImpact(100, 'car', 'test-user');
console.log(travelResult);

// Test electricity impact  
const electricityResult = await calculateElectricityImpact(200, 'grid', 'test-user');
console.log(electricityResult);
```

## API Usage Examples

### Travel Impact
```javascript
import { calculateTravelImpact, getTravelHistory } from '@/src/api/travel';

// Calculate impact
const result = await calculateTravelImpact(150, 'flight', 'user@example.com');
// Returns: { success: true, carbonFootprint: 18, equivalentTrees: 1, message: "..." }

// Get history
const history = await getTravelHistory('user@example.com');
```

### Electricity Impact
```javascript
import { calculateElectricityImpact, getElectricityHistory } from '@/src/api/electricity';

// Calculate impact
const result = await calculateElectricityImpact(300, 'grid', 'user@example.com');
// Returns: { success: true, monthlyCarbon: 246, annualCarbon: 2952, equivalentTrees: 148, message: "..." }

// Get history
const history = await getElectricityHistory('user@example.com');
```

## Folder Structure Created

```
f:\app\
├── .env.local (NEW - add your credentials)
├── src/ (NEW)
│   ├── supabaseClient.js (NEW)
│   └── api/
│       ├── travel.js (NEW)
│       └── electricity.js (NEW)
```

## Security Notes for Production

1. **Row Level Security (RLS)**: Currently allows anyone to read/write
   - For production, implement user authentication
   - Create policies based on authenticated users

2. **Use service_role key**: Store in backend only, never in frontend
   - NEXT_PUBLIC_ variables are exposed in browser

3. **Validate inputs**: All functions include basic validation

## Troubleshooting

### "Missing Supabase environment variables"
- Check .env.local file exists
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
- Restart dev server after updating .env.local

### "Connection refused"
- Verify your NEXT_PUBLIC_SUPABASE_URL is correct
- Check your internet connection
- Wait a few minutes if you just created the project

### Table doesn't exist
- Run the SQL query in Supabase SQL Editor
- Check table appears in Table Editor

## Next Steps

1. Integrate API calls into your React components
2. Add user authentication (Supabase Auth)
3. Implement data visualization with charts
4. Add export/download functionality
5. Create admin dashboard for analytics
