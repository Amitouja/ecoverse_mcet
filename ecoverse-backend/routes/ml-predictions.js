const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

/**
 * POST /api/ml/predict
 * Predict carbon footprint with ML model based on lifestyle data
 * 
 * Body: Comprehensive user lifestyle data object
 */
router.post('/predict', async (req, res) => {
  try {
    const userData = req.body;

    // Validation - check required fields
    const requiredFields = [
      'monthly_shopping_spend',
      'online_shopping_freq',
      'fast_fashion_items',
      'secondhand_items',
      'eco_products_ratio',
      'car_km_monthly',
      'public_transport_trips',
      'bike_walk_trips',
      'flights_per_year',
      'electricity_kwh',
      'heating_type',
      'renewable_energy',
      'diet_type',
      'food_waste_kg',
      'plastic_usage',
      'recycling_rate',
      'household_size',
      'age_group',
      'urban_rural',
      'diet_emission'
    ];

    // Check for missing fields
    for (const field of requiredFields) {
      if (userData[field] === undefined) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        });
      }
    }

    // Call Python prediction service
    const prediction = await callPythonPredictor(userData);

    res.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error('ML prediction error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'ML prediction failed',
    });
  }
});

/**
 * Helper function to call Python predictor
 */
function callPythonPredictor(userData) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, '../ml-service/predict.py');
    const python = spawn('python', [pythonPath], {
      cwd: path.join(__dirname, '../ml-service')
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('Python error:', stderr);
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        console.error('JSON parse error:', stdout);
        reject(parseError);
      }
    });

    // Send user data to Python via stdin
    python.stdin.write(JSON.stringify(userData));
    python.stdin.end();
  });
}

module.exports = router;
