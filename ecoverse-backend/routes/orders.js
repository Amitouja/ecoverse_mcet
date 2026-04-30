const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Get user's orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single order
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new order
router.post('/create', async (req, res) => {
  try {
    const { userId, items, total, shippingAddress, billingAddress } = req.body;

    // Calculate eco points
    const ecoPoints = Math.round(total / 50);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          total,
          status: 'completed',
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          items,
          eco_points_earned: ecoPoints,
        },
      ])
      .select();

    if (orderError) throw orderError;

    // Update user eco points
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('eco_points')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') throw userError;

    const currentPoints = user?.eco_points || 0;

    const { error: updateError } = await supabase
      .from('users')
      .update({ eco_points: currentPoints + ecoPoints })
      .eq('id', userId);

    if (updateError) throw updateError;

    res.json({ success: true, data: order[0], ecoPointsEarned: ecoPoints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cancel order
router.post('/:orderId/cancel', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (updateError) throw updateError;

    // Refund eco points
    const { error: refundError } = await supabase
      .from('users')
      .update({
        eco_points: order.eco_points_earned ? -order.eco_points_earned : 0,
      })
      .eq('id', order.user_id);

    if (refundError) throw refundError;

    res.json({ success: true, message: 'Order cancelled and points refunded' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
