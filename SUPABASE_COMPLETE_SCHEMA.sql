-- ============================================================================
-- ECOVERSE COMPLETE DATABASE SCHEMA
-- ============================================================================

-- Drop existing tables if needed
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS eco_actions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS carbon_footprint CASCADE;

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  eco_points INTEGER DEFAULT 0,
  carbon_footprint FLOAT DEFAULT 0,
  eco_rank TEXT DEFAULT 'SEED',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price FLOAT NOT NULL,
  image_url TEXT,
  eco_score INTEGER DEFAULT 50,
  tag TEXT CHECK (tag IN ('ORGANIC', 'RECYCLED', 'VEGAN')),
  material TEXT,
  eco_points_reward INTEGER,
  stock INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. CART ITEMS TABLE
-- ============================================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- ============================================================================
-- 4. ORDERS TABLE
-- ============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_price FLOAT NOT NULL,
  status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  eco_points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. REWARDS TABLE
-- ============================================================================
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  reward_type TEXT CHECK (reward_type IN ('DISCOUNT', 'CASHBACK', 'POINTS', 'COUPON', 'GIFT')),
  reward_value TEXT,
  reward_amount FLOAT,
  is_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  claimed_at TIMESTAMP
);

-- ============================================================================
-- 6. ECO ACTIONS TABLE
-- ============================================================================
CREATE TABLE eco_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT CHECK (action_type IN ('TRAVEL', 'ELECTRICITY', 'CHALLENGE', 'PURCHASE')),
  travel_type TEXT,
  distance FLOAT,
  transport_mode TEXT,
  carbon_saved FLOAT,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 7. CARBON FOOTPRINT TABLE
-- ============================================================================
CREATE TABLE carbon_footprint (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('TRAVEL', 'ELECTRICITY', 'SHOPPING', 'OTHER')),
  carbon_kg FLOAT NOT NULL,
  carbon_saved_kg FLOAT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERT SAMPLE PRODUCTS
-- ============================================================================
INSERT INTO products (name, description, price, image_url, eco_score, tag, material, eco_points_reward, stock) VALUES
  ('Organic Linen Tee', '100% Organic Cotton, breathable & soft', 1299, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=85', 95, 'ORGANIC', '100% Organic Cotton', 50, 15),
  ('Recycled Bomber', 'Post-Consumer Polyester, sustainable style', 3499, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=85', 88, 'RECYCLED', 'Post-Consumer Polyester', 70, 8),
  ('Hemp Canvas Kicks', 'Natural Hemp Fibre sneakers, durable & eco-friendly', 2799, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85', 91, 'VEGAN', 'Natural Hemp Fibre', 60, 12),
  ('Bamboo Joggers', 'Organic Bamboo Blend, super comfortable', 1899, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=85', 86, 'ORGANIC', 'Organic Bamboo Blend', 45, 20),
  ('Cactus Leather Jacket', 'Nopal Cactus Leather, innovative alternative', 5999, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=85', 82, 'VEGAN', 'Nopal Cactus Leather', 80, 5),
  ('Ocean Plastic Hoodie', 'Ocean-Recovered Nylon, saves marine plastic', 2199, 'https://images.unsplash.com/photo-1556821552-107f29c49b82?w=700&q=85', 93, 'RECYCLED', 'Ocean-Recovered Nylon', 65, 18),
  ('TENCEL Midi Dress', 'TENCEL™ Lyocell, soft & sustainable', 2899, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=85', 90, 'ORGANIC', 'TENCEL™ Lyocell', 55, 10),
  ('Cork Sneakers', 'Natural Cork + Recycled Rubber, lightweight', 3199, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85', 89, 'VEGAN', 'Cork + Recycled Rubber', 62, 14);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_product_id ON cart_items(product_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_eco_actions_user_id ON eco_actions(user_id);
CREATE INDEX idx_carbon_footprint_user_id ON carbon_footprint(user_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE eco_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_footprint ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can read their own cart
CREATE POLICY "cart_read_own" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert/update/delete their own cart items
CREATE POLICY "cart_insert_own" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_update_own" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart_delete_own" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Users can read their own orders
CREATE POLICY "orders_read_own" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own rewards
CREATE POLICY "rewards_read_own" ON rewards
  FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own eco actions
CREATE POLICY "eco_actions_read_own" ON eco_actions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own eco actions
CREATE POLICY "eco_actions_insert_own" ON eco_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own carbon footprint
CREATE POLICY "carbon_read_own" ON carbon_footprint
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own carbon footprint data
CREATE POLICY "carbon_insert_own" ON carbon_footprint
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ALLOW PUBLIC READ ACCESS TO PRODUCTS
-- ============================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read_public" ON products
  FOR SELECT USING (true);

-- ============================================================================
-- FUNCTIONS FOR ECO SCORE CALCULATION
-- ============================================================================

-- Function to calculate eco rank based on points
CREATE OR REPLACE FUNCTION calculate_eco_rank(points INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF points >= 5000 THEN RETURN 'FOREST_GUARDIAN';
  ELSIF points >= 1500 THEN RETURN 'TREE';
  ELSIF points >= 500 THEN RETURN 'SAPLING';
  ELSE RETURN 'SEED';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update user eco rank whenever points change
CREATE OR REPLACE FUNCTION update_eco_rank()
RETURNS TRIGGER AS $$
BEGIN
  NEW.eco_rank = calculate_eco_rank(NEW.eco_points);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update eco rank
CREATE TRIGGER trigger_update_eco_rank
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_eco_rank();

-- ============================================================================
-- SQL QUERIES FOR COMMON OPERATIONS
-- ============================================================================

-- Get user leaderboard (Top eco contributors)
-- SELECT email, full_name, eco_points, eco_rank 
-- FROM users 
-- ORDER BY eco_points DESC 
-- LIMIT 100;

-- Get user's reward history
-- SELECT id, reward_type, reward_value, is_claimed, created_at
-- FROM rewards
-- WHERE user_id = $1
-- ORDER BY created_at DESC;

-- Get carbon footprint summary
-- SELECT category, SUM(carbon_kg) as total_carbon, SUM(carbon_saved_kg) as total_saved
-- FROM carbon_footprint
-- WHERE user_id = $1
-- GROUP BY category;
