# 🤖 ML Model Setup Guide

## Quick Start (3 steps)

### Step 1: Install Python Dependencies
```bash
cd ecoverse-backend
pip install -r ml-service/requirements.txt
```

### Step 2: Train the ML Models
```bash
python ml-service/train.py
```

**Expected Output:**
```
Training carbon footprint prediction model...
✅ Carbon predictor model saved to ml-service/models/carbon_predictor.pkl
✅ Recommender model saved to ml-service/models/recommender.pkl
✨ Training complete! Models ready for predictions.
```

### Step 3: Start Backend
```bash
npm run dev
```

---

## API Endpoint

### POST `/api/ml/predict`

**Request:**
```json
{
  "distance": 150,
  "transportType": 1,
  "electricityUsage": 200
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCarbonFootprint": 31.8,
    "breakdown": {
      "transport": 18.0,
      "electricity": 16.4
    },
    "equivalentTrees": 2,
    "priority": "medium",
    "recommendations": [
      "Optimize commute routes",
      "Use renewable energy source",
      "Carpool when possible"
    ]
  }
}
```

---

## Transport Type Codes
- **1** = Flight (0.12 kg CO2/km)
- **2** = Car (0.21 kg CO2/km)
- **3** = Bus (0.10 kg CO2/km)
- **4** = Train (0.05 kg CO2/km)

---

## ML Features

✅ **Carbon Footprint Prediction** - Combined travel + electricity impact
✅ **Intelligent Breakdown** - See impact by category
✅ **Personalized Recommendations** - Based on carbon level
✅ **Priority Classification** - High/Medium/Low impact zones
✅ **Equivalent Impact** - Trees needed to offset CO2

---

## Project Structure
```
ecoverse-backend/
├── ml-service/
│   ├── train.py              ← Training script
│   ├── predict.py            ← Prediction script
│   ├── requirements.txt       ← Python dependencies
│   └── models/               ← Trained models (auto-created)
│       ├── carbon_predictor.pkl
│       └── recommender.pkl
├── api/
│   └── ml-predictor.js       ← Node.js wrapper
├── routes/
│   └── ml-predictions.js     ← API endpoint
└── server.js                 ← Updated with ML route
```

---

## Test the ML API

### Using cURL:
```bash
curl -X POST http://localhost:5000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 150,
    "transportType": 1,
    "electricityUsage": 200
  }'
```

### Using Node (test.js):
```javascript
const axios = require('axios');

async function testML() {
  const response = await axios.post('http://localhost:5000/api/ml/predict', {
    distance: 150,
    transportType: 1,
    electricityUsage: 200,
  });
  
  console.log(response.data);
}

testML();
```

---

## Troubleshooting

❌ **Error: Python not found**
- Make sure Python 3.8+ is installed
- Windows: Add Python to PATH

❌ **Error: Models not found**
- Run training first: `python ml-service/train.py`
- Check that `ml-service/models/` folder exists

❌ **Error: Module not found**
- Install dependencies: `pip install -r ml-service/requirements.txt`
- Or: `pip install scikit-learn numpy joblib pandas`

---

## Next Steps

1. ✅ Train models: `python ml-service/train.py`
2. ✅ Start backend: `npm run dev`
3. ✅ Create frontend component (see example below)
4. ✅ Connect to your React/Next.js app

