'use client';

import { useState } from 'react';

interface TravelEntry {
  type: 'flight' | 'car' | 'train' | 'bus';
  distance: number;
  passengers: number;
}

export default function TravelData() {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [newEntry, setNewEntry] = useState<TravelEntry>({ type: 'flight', distance: 0, passengers: 1 });

  const addEntry = () => {
    if (newEntry.distance > 0) {
      setEntries([...entries, newEntry]);
      setNewEntry({ type: 'flight', distance: 0, passengers: 1 });
    }
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const calculateCarbonFootprint = () => {
    return entries.reduce((total, entry) => {
      const baseEmission = {
        flight: 0.25, // kg CO2 per km
        car: 0.12,
        train: 0.04,
        bus: 0.08
      }[entry.type];

      return total + (baseEmission * entry.distance / entry.passengers);
    }, 0);
  };

  const totalFootprint = calculateCarbonFootprint();

  return (
    <section className="px-6 py-20 md:px-[52px] md:py-20 border-t border-ink/10">
      <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage block mb-3">
        // Travel Impact Calculator
      </span>
      <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold tracking-[-0.02em] mb-4">
        Track Your <em className="italic text-fern">Travel Footprint</em>
      </h2>
      <p className="text-[0.95rem] text-mid max-w-[600px] mx-auto leading-[1.8] mb-12">
        Calculate the carbon emissions from your travel and discover ways to reduce your environmental impact.
      </p>

      {/* Add Travel Entry */}
      <div className="max-w-md mx-auto mb-12 p-6 bg-white rounded-xl shadow-sm border border-ink/5">
        <h3 className="font-jost font-semibold text-lg mb-4 text-ink">Add Travel Entry</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mid mb-1">Travel Type</label>
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as TravelEntry['type'] })}
              className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern/20"
            >
              <option value="flight">✈️ Flight</option>
              <option value="car">🚗 Car</option>
              <option value="train">🚂 Train</option>
              <option value="bus">🚌 Bus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-mid mb-1">Distance (km)</label>
            <input
              type="number"
              value={newEntry.distance}
              onChange={(e) => setNewEntry({ ...newEntry, distance: Number(e.target.value) })}
              className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern/20"
              placeholder="Enter distance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mid mb-1">Passengers</label>
            <input
              type="number"
              min="1"
              value={newEntry.passengers}
              onChange={(e) => setNewEntry({ ...newEntry, passengers: Number(e.target.value) })}
              className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern/20"
            />
          </div>
          <button
            onClick={addEntry}
            className="w-full bg-fern text-white py-3 rounded-lg font-semibold hover:bg-moss transition-colors"
          >
            Add Travel Entry
          </button>
        </div>
      </div>

      {/* Travel Entries List */}
      {entries.length > 0 && (
        <div className="max-w-2xl mx-auto mb-12">
          <h3 className="font-jost font-semibold text-xl mb-6 text-ink">Your Travel Entries</h3>
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-ink/5">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {entry.type === 'flight' ? '✈️' : entry.type === 'car' ? '🚗' : entry.type === 'train' ? '🚂' : '🚌'}
                  </span>
                  <div>
                    <p className="font-medium text-ink capitalize">{entry.type}</p>
                    <p className="text-sm text-mid">{entry.distance} km • {entry.passengers} passenger{entry.passengers > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-fern">
                    {(entry.distance / entry.passengers * {
                      flight: 0.25,
                      car: 0.12,
                      train: 0.04,
                      bus: 0.08
                    }[entry.type]).toFixed(1)} kg CO₂
                  </span>
                  <button
                    onClick={() => removeEntry(index)}
                    className="text-mid hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carbon Footprint Summary */}
      {totalFootprint > 0 && (
        <div className="max-w-md mx-auto text-center">
          <div className="p-8 bg-gradient-to-br from-fern/10 to-moss/10 rounded-2xl border border-fern/20">
            <h3 className="font-playfair text-2xl font-bold mb-2 text-ink">Total Carbon Footprint</h3>
            <p className="text-4xl font-bold text-fern mb-4">{totalFootprint.toFixed(1)} kg CO₂</p>
            <p className="text-sm text-mid mb-6">
              Equivalent to planting {Math.ceil(totalFootprint / 20)} trees to offset this impact.
            </p>
            <button className="bg-fern text-white px-6 py-3 rounded-lg font-semibold hover:bg-moss transition-colors">
              🌱 Offset with Eco Purchase
            </button>
          </div>
        </div>
      )}
    </section>
  );
}