'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';

interface MLPredictionResult {
  success: boolean;
  data?: {
    totalCarbonFootprint: number;
    breakdown: {
      transport: number;
      electricity: number;
      shopping: number;
      diet: number;
      waste: number;
    };
    equivalentTrees: number;
    priority: 'low' | 'medium' | 'high';
    recommendations: string[];
  };
  error?: string;
}

export default function MLResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<MLPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopping_spend: 300,
    online_orders: 5,
    fast_fashion: 3,
    eco_products: 0.3,
    car_km: 300,
    flights_per_year: 1,
    electricity_kwh: 250,
    diet_type: 1,
    household_size: 2
  });

  const predictCarbon = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, error: 'Failed to get prediction. Make sure backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟠';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-cream to-white">
        <section className="px-6 py-20 md:px-[52px] md:py-20">
          <button
            onClick={() => router.back()}
            className="mb-6 text-fern hover:text-moss font-semibold"
          >
            ← Back
          </button>

          <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage block mb-3">
            // ML Carbon Footprint Predictor
          </span>
          <h1 className="font-playfair text-[clamp(2.2rem,4vw,3.2rem)] font-bold tracking-[-0.02em] mb-4">
            AI-Powered <em className="italic text-fern">Carbon Predictions</em>
          </h1>
          <p className="text-[0.95rem] text-mid max-w-[600px] leading-[1.8] mb-12">
            Get personalized carbon footprint predictions based on your lifestyle using machine learning.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-ink/10">
              <h2 className="text-xl font-bold mb-6 text-ink">Your Lifestyle Data</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Monthly Shopping ($)</label>
                  <input
                    type="number"
                    value={formData.shopping_spend}
                    onChange={(e) => setFormData({ ...formData, shopping_spend: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Online Orders/Month</label>
                  <input
                    type="number"
                    value={formData.online_orders}
                    onChange={(e) => setFormData({ ...formData, online_orders: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Fast Fashion Items/Month</label>
                  <input
                    type="number"
                    value={formData.fast_fashion}
                    onChange={(e) => setFormData({ ...formData, fast_fashion: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Eco Products Ratio (0-1)</label>
                  <input
                    type="number"
                    value={formData.eco_products}
                    onChange={(e) => setFormData({ ...formData, eco_products: Math.min(1, Math.max(0, Number(e.target.value))) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Car km/Month</label>
                  <input
                    type="number"
                    value={formData.car_km}
                    onChange={(e) => setFormData({ ...formData, car_km: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Flights/Year</label>
                  <input
                    type="number"
                    value={formData.flights_per_year}
                    onChange={(e) => setFormData({ ...formData, flights_per_year: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Electricity (kWh/Month)</label>
                  <input
                    type="number"
                    value={formData.electricity_kwh}
                    onChange={(e) => setFormData({ ...formData, electricity_kwh: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Household Size</label>
                  <input
                    type="number"
                    value={formData.household_size}
                    onChange={(e) => setFormData({ ...formData, household_size: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg"
                    min="1"
                  />
                </div>

                <button
                  onClick={predictCarbon}
                  disabled={loading}
                  className="w-full bg-fern text-white py-3 rounded-lg font-semibold hover:bg-moss transition-colors disabled:opacity-50"
                >
                  {loading ? '🤖 Predicting...' : '🤖 Get Prediction'}
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {result.success && result.data ? (
                  <>
                    {/* Main Stats */}
                    <div className="p-6 bg-gradient-to-br from-fern/10 to-moss/10 rounded-xl border border-fern/20">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-mid text-sm mb-1">Total Monthly Carbon Footprint</p>
                          <p className="text-4xl font-bold text-fern">{result.data.totalCarbonFootprint.toFixed(1)} kg</p>
                        </div>
                        <div className="text-right">
                          <p className="text-mid text-sm mb-1">Priority Level</p>
                          <p className={`text-2xl font-bold ${getPriorityColor(result.data.priority)}`}>
                            {getPriorityEmoji(result.data.priority)} {result.data.priority.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-mid">Equivalent to {result.data.equivalentTrees} trees needed to offset 🌳</p>
                    </div>

                    {/* Breakdown */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-ink/10">
                      <h3 className="font-bold text-lg mb-4 text-ink">Carbon Breakdown</h3>
                      <div className="space-y-3">
                        {result.data && Object.entries(result.data.breakdown).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-mid capitalize">{key}</span>
                              <span className="text-sm font-semibold text-fern">{value.toFixed(2)} kg</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-fern rounded-full"
                                style={{ width: `${(value / (result.data?.totalCarbonFootprint || 1)) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="p-6 bg-sage/10 rounded-xl border border-sage/20">
                      <h3 className="font-bold text-lg mb-4 text-ink">💡 Personalized Recommendations</h3>
                      <ul className="space-y-2">
                        {result.data.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-mid flex items-start">
                            <span className="mr-2">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-red-600 font-semibold">⚠️ Error</p>
                    <p className="text-red-500 text-sm">{result.error}</p>
                    <p className="text-xs text-red-400 mt-2">Make sure the backend server is running on port 5000</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {!result && !loading && (
            <div className="mt-12 p-8 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-700 font-semibold mb-2">ℹ️ How this works</p>
              <p className="text-blue-600 text-sm">Fill in your lifestyle information above and click "Get Prediction" to see your AI-powered carbon footprint analysis. Our machine learning model is trained on real-world emission data.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
