const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('cart_items')
      .select(
        `
        id,
        product_id,
        user_id,
        quantity,
        products (
          id,
          name,
          price,
          image_url,
          eco_score,
          tag
        )
      `
      )
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if item already exists
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select();

      if (error) throw error;
      res.json({ success: true, data });
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity }])
        .select();

      if (error) throw error;
      res.json({ success: true, data });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove item from cart
router.delete('/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update item quantity
router.put('/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Delete item if quantity is 0
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
      return res.json({ success: true, message: 'Item removed' });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear user's cart
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
