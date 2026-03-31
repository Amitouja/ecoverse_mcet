const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// Calculate travel impact
router.post("/calculate", async (req, res) => {
  try {
    const { distance, transport, userId } = req.body;

    if (!distance || !transport) {
      return res.status(400).json({ error: "Missing distance or transport type" });
    }

    let factor = 0.12;
    if (transport === "car") factor = 0.21;
    if (transport === "bus") factor = 0.10;
    if (transport === "train") factor = 0.05;

    const carbon = distance * factor;

    // Store in Supabase
    const { data, error } = await supabase
      .from("footprints")
      .insert([
        {
          user_id: userId || "anonymous",
          type: "travel",
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
    console.error("Travel calculation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get travel history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("footprints")
      .select("*")
      .eq("user_id", userId)
      .eq("type", "travel")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      history: data || [],
    });
  } catch (error) {
    console.error("Travel history error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
