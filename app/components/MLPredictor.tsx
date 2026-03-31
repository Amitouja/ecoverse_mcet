"use client";

import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

interface PredictionResult {
  carbonFootprint: number;
  equivalentTrees: number;
  priority: string;
  priorityLevel: string;
  breakdown: {
    shopping: number;
    transport: number;
    electricity: number;
    diet: number;
    waste: number;
  };
  recommendations: string[];
  percentageAboveAverage: number;
  targetEmissions: number;
  monthsSaved: number;
}

export default function MLPredictor() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    monthly_shopping_spend: 300,
    online_shopping_freq: 8,
    fast_fashion_items: 5,
    secondhand_items: 2,
    eco_products_ratio: 0.3,
    car_km_monthly: 400,
    public_transport_trips: 20,
    bike_walk_trips: 10,
    flights_per_year: 2,
    electricity_kwh: 250,
    heating_type: "electric",
    renewable_energy: 0,
    diet_type: "balanced",
    food_waste_kg: 8,
    plastic_usage: "medium",
    recycling_rate: 0.6,
    household_size: 2,
    age_group: "26-35",
    urban_rural: "suburban",
    diet_emission: 150,
  });

  const handlePrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ml/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setPrediction(data.data);
      }
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#7bc957", "#e8d9c0", "#c8d8e8", "#d8cce8", "#d4e6c3"];

  const breakdownData = prediction
    ? [
        { name: "Shopping", value: prediction.breakdown.shopping },
        { name: "Transport", value: prediction.breakdown.transport },
        { name: "Electricity", value: prediction.breakdown.electricity },
        { name: "Diet", value: prediction.breakdown.diet },
        { name: "Waste", value: prediction.breakdown.waste },
      ]
    : [];

  const progressData = prediction
    ? [
        {
          name: "Current",
          emissions: prediction.carbonFootprint,
          fill: "#ff6b6b",
        },
        {
          name: "Medium Goal",
          emissions: prediction.targetEmissions,
          fill: "#7bc957",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2eb] via-[#d4e6c3] to-[#c8d8e8] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-[#1a1a1a]">
            🤖 ML Carbon Predictor
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Get real-time AI-powered predictions of your carbon footprint based on your shopping, lifestyle, and travel habits.
          </p>
        </div>

        {!showForm && !prediction && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#1a1a1a]">
              Ready to track your impact?
            </h2>
            <p className="text-gray-600 mb-6">
              Use our AI model trained on 5,000+ real carbon footprint patterns
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#7bc957] hover:bg-[#66a946] text-white font-bold py-3 px-8 rounded-xl transition"
            >
              Start Prediction
            </button>
          </div>
        )}

        {showForm && !prediction && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8 text-[#1a1a1a]">
              Tell us about your lifestyle 📋
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shopping Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#1a1a1a] text-lg">🛍️ Shopping Habits</h3>
                <label className="block">
                  <span className="text-sm font-semibold">Monthly Spending ($)</span>
                  <input
                    type="number"
                    value={formData.monthly_shopping_spend}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthly_shopping_spend: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Online Orders/Month</span>
                  <input
                    type="number"
                    value={formData.online_shopping_freq}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        online_shopping_freq: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Fast Fashion Items/Month</span>
                  <input
                    type="number"
                    value={formData.fast_fashion_items}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fast_fashion_items: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Eco Products Ratio (0-1)</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.eco_products_ratio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        eco_products_ratio: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
              </div>

              {/* Transport Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#1a1a1a] text-lg">🚗 Transport</h3>
                <label className="block">
                  <span className="text-sm font-semibold">Car km/Month</span>
                  <input
                    type="number"
                    value={formData.car_km_monthly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        car_km_monthly: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Public Transport Trips/Month</span>
                  <input
                    type="number"
                    value={formData.public_transport_trips}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        public_transport_trips: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Bike/Walk Trips/Month</span>
                  <input
                    type="number"
                    value={formData.bike_walk_trips}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bike_walk_trips: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Flights/Year</span>
                  <input
                    type="number"
                    value={formData.flights_per_year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        flights_per_year: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
              </div>

              {/* Energy Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#1a1a1a] text-lg">⚡ Energy</h3>
                <label className="block">
                  <span className="text-sm font-semibold">Electricity kWh/Month</span>
                  <input
                    type="number"
                    value={formData.electricity_kwh}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        electricity_kwh: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Heating Type</span>
                  <select
                    value={formData.heating_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heating_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  >
                    <option>gas</option>
                    <option>electric</option>
                    <option>renewable</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Renewable Energy? (1=Yes, 0=No)</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    value={formData.renewable_energy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        renewable_energy: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
              </div>

              {/* Lifestyle Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-[#1a1a1a] text-lg">🌱 Lifestyle</h3>
                <label className="block">
                  <span className="text-sm font-semibold">Diet Type</span>
                  <select
                    value={formData.diet_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        diet_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  >
                    <option>meat_heavy</option>
                    <option>balanced</option>
                    <option>vegetarian</option>
                    <option>vegan</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Food Waste kg/Week</span>
                  <input
                    type="number"
                    value={formData.food_waste_kg}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        food_waste_kg: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Plastic Usage</span>
                  <select
                    value={formData.plastic_usage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        plastic_usage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  >
                    <option>high</option>
                    <option>medium</option>
                    <option>low</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold">Recycling Rate (0-1)</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.recycling_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recycling_rate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg mt-1"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePrediction}
                disabled={loading}
                className="flex-1 bg-[#7bc957] hover:bg-[#66a946] text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? "🤔 Analyzing..." : "🔮 Get Prediction"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setPrediction(null);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-[#1a1a1a] font-bold py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {prediction && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="text-5xl mb-2">{prediction.priorityLevel}</div>
                <p className="text-gray-600 mb-2">Priority Level</p>
                <p className="text-2xl font-bold text-[#1a1a1a]">
                  {prediction.priority.toUpperCase()}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="text-5xl font-bold text-[#7bc957] mb-2">
                  {prediction.carbonFootprint}
                </div>
                <p className="text-gray-600 mb-2">kg CO2e/Month</p>
                <p className="text-sm text-gray-500">{prediction.percentageAboveAverage}% above average</p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {prediction.equivalentTrees}
                </div>
                <p className="text-gray-600">Trees Needed/Year</p>
                <p className="text-sm text-gray-500">to offset emissions</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Carbon Breakdown Pie Chart */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a]">
                  📊 Carbon Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name}: ${entry.value.toFixed(1)}kg`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value.toFixed(2)} kg`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Current vs Target Bar Chart */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a]">
                  🎯 Current vs Target
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="emissions" fill="#8884d8">
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a]">
                💡 Personalized Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prediction.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-[#d4e6c3] to-[#c8d8e8] p-4 rounded-xl border-l-4 border-[#7bc957]"
                  >
                    <p className="text-[#1a1a1a] font-semibold">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <button
                onClick={() => {
                  setShowForm(false);
                  setPrediction(null);
                }}
                className="bg-[#7bc957] hover:bg-[#66a946] text-white font-bold py-3 px-8 rounded-xl transition"
              >
                Get Another Prediction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
