'use client';

import { useState } from 'react';

interface ElectricityData {
  monthlyUsage: number; // kWh
  energySource: 'grid' | 'renewable' | 'mixed';
  householdSize: number;
}

export default function ElectricityUsage() {
  const [data, setData] = useState<ElectricityData>({
    monthlyUsage: 0,
    energySource: 'grid',
    householdSize: 1
  });

  const calculateCarbonFootprint = () => {
    const baseEmission = {
      grid: 0.4, // kg CO2 per kWh (average grid mix)
      renewable: 0.02, // kg CO2 per kWh (solar/wind)
      mixed: 0.2 // kg CO2 per kWh (mixed sources)
    }[data.energySource];

    return baseEmission * data.monthlyUsage;
  };

  const calculateAnnualFootprint = () => calculateCarbonFootprint() * 12;

  const getRecommendations = () => {
    const footprint = calculateCarbonFootprint();
    const recommendations = [];

    if (data.energySource === 'grid') {
      recommendations.push("Consider switching to renewable energy sources like solar panels");
    }

    if (footprint > 50) {
      recommendations.push("Install LED bulbs and energy-efficient appliances");
    }

    if (data.monthlyUsage > 300) {
      recommendations.push("Unplug electronics when not in use and use smart power strips");
    }

    recommendations.push("Monitor usage with smart meters and set conservation goals");

    return recommendations;
  };

  const footprint = calculateCarbonFootprint();
  const annualFootprint = calculateAnnualFootprint();

  return (
    <section className="px-6 py-20 md:px-[52px] md:py-20 border-t border-ink/10">
      <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage block mb-3">
        // Electricity Impact Calculator
      </span>
      <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold tracking-[-0.02em] mb-4">
        Monitor Your <em className="italic text-fern">Electricity Usage</em>
      </h2>
      <p className="text-[0.95rem] text-mid max-w-[600px] mx-auto leading-[1.8] mb-12">
        Track your household electricity consumption and calculate your carbon footprint from energy use.
      </p>

      {/* Input Form */}
      <div className="max-w-md mx-auto mb-12 p-6 bg-white rounded-xl shadow-sm border border-ink/5">
        <h3 className="font-jost font-semibold text-lg mb-6 text-ink">Electricity Details</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-mid mb-2">Monthly Usage (kWh)</label>
            <input
              type="number"
              value={data.monthlyUsage}
              onChange={(e) => setData({ ...data, monthlyUsage: Number(e.target.value) })}
              className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern/20"
              placeholder="Enter kWh used per month"
            />
            <p className="text-xs text-mid mt-1">Check your electricity bill for this information</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-mid mb-2">Energy Source</label>
            <select
              value={data.energySource}
              onChange={(e) => setData({ ...data, energySource: e.target.value as ElectricityData['energySource'] })}
              className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern/20"
            >
              <option value="grid">🔌 Grid Electricity (Standard)</option>
              <option value="renewable">☀️ Renewable Energy (Solar/Wind)</option>
              <option value="mixed">⚡ Mixed Sources</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mid mb-2">Household Size</label>
            <input
              type="number"
              min="1"
              value={data.householdSize}
              onChange={(e) => setData({ ...data, householdSize: Number(e.target.value) })}
              className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern/20"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {data.monthlyUsage > 0 && (
        <div className="max-w-2xl mx-auto">
          {/* Carbon Footprint Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-ink/5 text-center">
              <h4 className="font-jost font-semibold text-lg mb-2 text-ink">Monthly Footprint</h4>
              <p className="text-3xl font-bold text-fern mb-1">{footprint.toFixed(1)} kg CO₂</p>
              <p className="text-sm text-mid">Carbon emissions per month</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-ink/5 text-center">
              <h4 className="font-jost font-semibold text-lg mb-2 text-ink">Annual Footprint</h4>
              <p className="text-3xl font-bold text-fern mb-1">{annualFootprint.toFixed(1)} kg CO₂</p>
              <p className="text-sm text-mid">Carbon emissions per year</p>
            </div>
          </div>

          {/* Per Person Breakdown */}
          <div className="p-6 bg-gradient-to-r from-mint/20 to-leaf/10 rounded-xl border border-leaf/20 mb-8">
            <h4 className="font-jost font-semibold text-lg mb-4 text-ink">Per Person Impact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-leaf">{(footprint / data.householdSize).toFixed(1)}</p>
                <p className="text-sm text-mid">kg CO₂/month per person</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-leaf">{(annualFootprint / data.householdSize).toFixed(1)}</p>
                <p className="text-sm text-mid">kg CO₂/year per person</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-6 bg-white rounded-xl shadow-sm border border-ink/5">
            <h4 className="font-jost font-semibold text-lg mb-4 text-ink flex items-center gap-2">
              💡 Eco-Friendly Recommendations
            </h4>
            <ul className="space-y-3">
              {getRecommendations().map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-fern mt-1">•</span>
                  <span className="text-mid leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Offset Action */}
          <div className="text-center mt-8">
            <button className="bg-fern text-white px-8 py-4 rounded-lg font-semibold hover:bg-moss transition-colors inline-flex items-center gap-2">
              🌱 Offset Carbon with Eco Purchase
            </button>
            <p className="text-sm text-mid mt-3">
              Support renewable energy projects and reduce your carbon footprint
            </p>
          </div>
        </div>
      )}
    </section>
  );
}