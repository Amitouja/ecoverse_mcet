'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';

interface ElectricityEntry {
  id?: string;
  monthlyUsage: number;
  energySource: 'grid' | 'renewable' | 'mixed';
  householdSize: number;
  carbon: number;
  annualCarbon: number;
  date?: string;
}

export default function ElectricityPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ElectricityEntry[]>([]);
  const [newEntry, setNewEntry] = useState<ElectricityEntry>({
    monthlyUsage: 0,
    energySource: 'grid',
    householdSize: 1,
    carbon: 0,
    annualCarbon: 0
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const factors = {
    grid: 0.4,
    renewable: 0.02,
    mixed: 0.2
  };

  const calculateCarbon = (usage: number, source: string) => {
    const factor = factors[source as keyof typeof factors] || 0.4;
    const monthly = parseFloat((usage * factor).toFixed(2));
    const annual = parseFloat((monthly * 12).toFixed(2));
    return { monthly, annual };
  };

  const addEntry = async () => {
    if (newEntry.monthlyUsage <= 0 || newEntry.householdSize <= 0) {
      alert('Please enter valid values');
      return;
    }

    const { monthly, annual } = calculateCarbon(newEntry.monthlyUsage, newEntry.energySource);
    const entryWithCarbon = {
      ...newEntry,
      carbon: monthly,
      annualCarbon: annual,
      date: new Date().toISOString()
    };

    setLoading(true);
    try {
      const response = await fetch('/api/electricity/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryWithCarbon)
      });

      if (response.ok) {
        setEntries([...entries, entryWithCarbon]);
        setNewEntry({
          monthlyUsage: 0,
          energySource: 'grid',
          householdSize: 1,
          carbon: 0,
          annualCarbon: 0
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error saving entry');
    } finally {
      setLoading(false);
    }
  };

  const removeEntry = async (index: number) => {
    const entry = entries[index];
    setLoading(true);
    try {
      await fetch('/api/electricity/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id })
      });
      setEntries(entries.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const latestEntry = entries[entries.length - 1];
  const totalAnnualCarbon = entries.reduce((sum, entry) => sum + entry.annualCarbon, 0);
  const totalTrees = Math.ceil(totalAnnualCarbon / 20);

  const getRecommendations = (source: string, usage: number) => {
    const recommendations = [];
    if (source === 'grid') {
      recommendations.push('☀️ Switch to renewable energy sources');
    }
    if (usage > 300) {
      recommendations.push('💡 Install LED bulbs and upgrade appliances');
    }
    if (usage > 150) {
      recommendations.push('🔌 Use smart power strips and unplug devices');
    }
    recommendations.push('📊 Monitor usage with smart meters regularly');
    return recommendations;
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
            // Electricity Impact Tracker
          </span>
          <h1 className="font-playfair text-[clamp(2.2rem,4vw,3.2rem)] font-bold tracking-[-0.02em] mb-4">
            Monitor Your <em className="italic text-fern">Electricity Usage</em>
          </h1>
          <p className="text-[0.95rem] text-mid max-w-[600px] leading-[1.8] mb-12">
            Track your household electricity consumption and understand your carbon footprint from energy use.
          </p>

          {/* Stats Cards */}
          {latestEntry && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-fern/20">
                <p className="text-mid text-sm mb-2">Monthly CO₂</p>
                <p className="text-3xl font-bold text-fern">{latestEntry.carbon.toFixed(2)} kg</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-sage/20">
                <p className="text-mid text-sm mb-2">Annual CO₂</p>
                <p className="text-3xl font-bold text-sage">{latestEntry.annualCarbon.toFixed(0)} kg</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-moss/20">
                <p className="text-mid text-sm mb-2">Trees to Offset</p>
                <p className="text-3xl font-bold text-moss">{Math.ceil(latestEntry.annualCarbon / 20)} 🌳</p>
              </div>
            </div>
          )}

          {/* Add Entry Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 px-8 py-3 bg-fern text-white rounded-lg font-semibold hover:bg-moss transition-colors"
            >
              + Add Electricity Reading
            </button>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-ink/10">
              <h2 className="text-xl font-bold mb-6 text-ink">Log Electricity Usage</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Monthly Usage (kWh)</label>
                  <input
                    type="number"
                    value={newEntry.monthlyUsage}
                    onChange={(e) => setNewEntry({ ...newEntry, monthlyUsage: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern"
                    placeholder="Check your electricity bill"
                    min="0"
                  />
                  <p className="text-xs text-sage mt-1">Find this on your monthly electricity bill</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Energy Source</label>
                  <select
                    value={newEntry.energySource}
                    onChange={(e) => setNewEntry({ ...newEntry, energySource: e.target.value as ElectricityEntry['energySource'] })}
                    className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern"
                  >
                    <option value="grid">🔌 Grid Electricity</option>
                    <option value="renewable">☀️ Renewable Energy</option>
                    <option value="mixed">⚡ Mixed Sources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Household Size</label>
                  <input
                    type="number"
                    value={newEntry.householdSize}
                    onChange={(e) => setNewEntry({ ...newEntry, householdSize: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern"
                    placeholder="Number of people"
                    min="1"
                  />
                </div>

                {newEntry.monthlyUsage > 0 && (
                  <div className="p-4 bg-fern/10 rounded-lg space-y-2">
                    <p className="text-sm text-fern font-semibold">
                      Monthly CO₂: {calculateCarbon(newEntry.monthlyUsage, newEntry.energySource).monthly.toFixed(2)} kg
                    </p>
                    <p className="text-sm text-fern font-semibold">
                      Annual CO₂: {calculateCarbon(newEntry.monthlyUsage, newEntry.energySource).annual.toFixed(2)} kg
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={addEntry}
                    disabled={loading}
                    className="flex-1 bg-fern text-white py-3 rounded-lg font-semibold hover:bg-moss transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Add Reading'}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-ink/10 text-ink py-3 rounded-lg font-semibold hover:bg-ink/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {latestEntry && (
            <div className="mb-8 p-6 bg-sage/10 rounded-xl border border-sage/20">
              <h3 className="font-semibold text-ink mb-4">💡 Personalized Recommendations</h3>
              <ul className="space-y-2">
                {getRecommendations(latestEntry.energySource, latestEntry.monthlyUsage).map((rec, idx) => (
                  <li key={idx} className="text-sm text-mid">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Entries List */}
          {entries.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-ink">Your Records</h3>
              <div className="space-y-3">
                {entries.map((entry, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-ink/10 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-ink">
                        {entry.monthlyUsage} kWh/month · {entry.energySource === 'grid' && '🔌'}{entry.energySource === 'renewable' && '☀️'}{entry.energySource === 'mixed' && '⚡'}
                      </p>
                      <p className="text-sm text-mid">Monthly: {entry.carbon.toFixed(2)} kg | Annual: {entry.annualCarbon.toFixed(0)} kg CO₂</p>
                    </div>
                    <button
                      onClick={() => removeEntry(idx)}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {entries.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-mid mb-4">No readings recorded yet</p>
              <p className="text-sm text-sage">Start tracking your electricity usage to understand your carbon impact</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
