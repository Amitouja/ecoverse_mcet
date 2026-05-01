const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Reward generation options
const REWARD_OPTIONS = [
  { type: 'DISCOUNT', value: '10% OFF', amount: 0 },
  { type: 'DISCOUNT', value: '20% OFF', amount: 0 },
  { type: 'DISCOUNT', value: '5% OFF', amount: 0 },
  { type: 'CASHBACK', value: '₹25 Cashback', amount: 25 },
  { type: 'CASHBACK', value: '₹50 Cashback', amount: 50 },
  { type: 'CASHBACK', value: '₹100 Cashback', amount: 100 },
  { type: 'POINTS', value: '2x Points', amount: 0 },
  { type: 'POINTS', value: '1.5x Points', amount: 0 },
  { type: 'COUPON', value: 'Free Shipping', amount: 0 },
  { type: 'COUPON', value: '₹100 Store Credit', amount: 100 },
  { type: 'GIFT', value: 'Plant a Tree 🌱', amount: 0 },
  { type: 'GIFT', value: 'VIP Access', amount: 0 },
];

// Generate random reward
const generateRandomReward = () => {
  return REWARD_OPTIONS[Math.floor(Math.random() * REWARD_OPTIONS.length)];
};

// Get user's rewards
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get unclaimed rewards
router.get('/user/:userId/unclaimed', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .eq('is_claimed', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data, count: data?.length || 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate rewards for order
router.post('/generate-for-order', async (req, res) => {
  try {
    const { userId, orderId, ecoPointsEarned } = req.body;

    // Generate 1-3 random rewards based on eco points
    const rewardCount = Math.min(3, Math.ceil(ecoPointsEarned / 100));
    const generatedRewards = [];

    for (let i = 0; i < rewardCount; i++) {
      const reward = generateRandomReward();
      generatedRewards.push({
        user_id: userId,
        order_id: orderId,
        reward_type: reward.type,
        reward_value: reward.value,
        reward_amount: reward.amount,
        is_claimed: false,
      });
    }

    // Insert rewards
    const { data, error } = await supabase
      .from('rewards')
      .insert(generatedRewards)
      .select();

    if (error) throw error;

    res.json({ success: true, data, message: `Generated ${rewardCount} rewards!` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate reward for eco action
router.post('/generate-for-action', async (req, res) => {
  try {
    const { userId, actionType, pointsEarned } = req.body;

    // 50% chance to generate a reward for eco actions
    if (Math.random() > 0.5) {
      const reward = generateRandomReward();

      const { data, error } = await supabase
        .from('rewards')
        .insert([
          {
            user_id: userId,
            reward_type: reward.type,
            reward_value: reward.value,
            reward_amount: reward.amount,
            is_claimed: false,
          },
        ])
        .select();

      if (error) throw error;

      res.json({ success: true, data, message: 'Reward unlocked!', reward: data[0] });
    } else {
      res.json({ success: true, message: 'Better luck next time!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Claim reward
router.post('/:rewardId/claim', async (req, res) => {
  try {
    const { rewardId } = req.params;

    const { data, error } = await supabase
      .from('rewards')
      .update({
        is_claimed: true,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', rewardId)
      .select();

    if (error) throw error;

    res.json({ success: true, data: data[0], message: 'Reward claimed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk claim rewards
router.post('/claim-multiple', async (req, res) => {
  try {
    const { rewardIds } = req.body;

    const { data, error } = await supabase
      .from('rewards')
      .update({
        is_claimed: true,
        claimed_at: new Date().toISOString(),
      })
      .in('id', rewardIds)
      .select();

    if (error) throw error;

    res.json({ success: true, data, message: `Claimed ${rewardIds.length} rewards!` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reward stats
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const totalRewards = data?.length || 0;
    const claimedRewards = data?.filter(r => r.is_claimed).length || 0;
    const unclaimedRewards = totalRewards - claimedRewards;
    const totalCashback = data
      ?.filter(r => r.reward_type === 'CASHBACK')
      .reduce((sum, r) => sum + r.reward_amount, 0) || 0;

    res.json({
      success: true,
      stats: {
        totalRewards,
        claimedRewards,
        unclaimedRewards,
        totalCashback,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
