const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// Calculate electricity impact
router.post("/calculate", async (req, res) => {
  try {
    const { monthlyUsage, userId } = req.body;

    if (!monthlyUsage) {
      return res.status(400).json({ error: "Missing monthly usage" });
    }

    const carbon = monthlyUsage * 0.82;

    // Store in Supabase
    const { data, error } = await supabase
      .from("footprints")
      .insert([
        {
          user_id: userId || "anonymous",
          type: "electricity",
          carbon_footprint: carbon,
        },
      ]);

    if (error) throw error;

    res.json({
      success: true,
      carbonFootprint: carbon,
      equivalentTrees: Math.ceil(carbon / 20),
    });
  } catch (error) {
    console.error("Electricity calculation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get electricity history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("footprints")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "electricity")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      history: data || [],
    });
  } catch (error) {
    console.error("Electricity history error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
