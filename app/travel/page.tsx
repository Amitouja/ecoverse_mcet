'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';

interface TravelEntry {
  id?: string;
  type: 'flight' | 'car' | 'train' | 'bus';
  distance: number;
  passengers: number;
  carbon: number;
  date?: string;
}

export default function TravelPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [newEntry, setNewEntry] = useState<TravelEntry>({
    type: 'flight',
    distance: 0,
    passengers: 1,
    carbon: 0
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const factors = {
    flight: 0.25,
    car: 0.12,
    train: 0.04,
    bus: 0.08
  };

  const calculateCarbon = (type: string, distance: number, passengers: number) => {
    const factor = factors[type as keyof typeof factors] || 0.12;
    return parseFloat((factor * distance / passengers).toFixed(2));
  };

  const addEntry = async () => {
    if (newEntry.distance <= 0 || newEntry.passengers <= 0) {
      alert('Please enter valid distance and passengers');
      return;
    }

    const carbon = calculateCarbon(newEntry.type, newEntry.distance, newEntry.passengers);
    const entryWithCarbon = { ...newEntry, carbon, date: new Date().toISOString() };

    setLoading(true);
    try {
      // Save to Supabase
      const response = await fetch('/api/travel/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryWithCarbon)
      });

      if (response.ok) {
        setEntries([...entries, entryWithCarbon]);
        setNewEntry({ type: 'flight', distance: 0, passengers: 1, carbon: 0 });
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
      await fetch('/api/travel/delete', {
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

  const totalCarbon = entries.reduce((sum, entry) => sum + entry.carbon, 0);
  const totalTrees = Math.ceil(totalCarbon / 20);

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
            // Travel Impact Tracker
          </span>
          <h1 className="font-playfair text-[clamp(2.2rem,4vw,3.2rem)] font-bold tracking-[-0.02em] mb-4">
            Track Your <em className="italic text-fern">Travel Footprint</em>
          </h1>
          <p className="text-[0.95rem] text-mid max-w-[600px] leading-[1.8] mb-12">
            Calculate carbon emissions from your trips and discover ways to travel more sustainably.
          </p>

          {/* Stats Cards */}
          {totalCarbon > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-fern/20">
                <p className="text-mid text-sm mb-2">Total CO₂ Emissions</p>
                <p className="text-3xl font-bold text-fern">{totalCarbon.toFixed(2)} kg</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-sage/20">
                <p className="text-mid text-sm mb-2">Tree Equivalent</p>
                <p className="text-3xl font-bold text-sage">{totalTrees} 🌳</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-moss/20">
                <p className="text-mid text-sm mb-2">Entries</p>
                <p className="text-3xl font-bold text-moss">{entries.length}</p>
              </div>
            </div>
          )}

          {/* Add Entry Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 px-8 py-3 bg-fern text-white rounded-lg font-semibold hover:bg-moss transition-colors"
            >
              + Add Travel Entry
            </button>
          )}

          {/* Form Modal */}
          {showForm && (
            <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-ink/10">
              <h2 className="text-xl font-bold mb-6 text-ink">Add New Trip</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Travel Type</label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as TravelEntry['type'] })}
                    className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern"
                  >
                    <option value="flight">✈️ Flight</option>
                    <option value="car">🚗 Car</option>
                    <option value="train">🚂 Train</option>
                    <option value="bus">🚌 Bus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Distance (km)</label>
                  <input
                    type="number"
                    value={newEntry.distance}
                    onChange={(e) => setNewEntry({ ...newEntry, distance: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mid mb-2">Passengers</label>
                  <input
                    type="number"
                    value={newEntry.passengers}
                    onChange={(e) => setNewEntry({ ...newEntry, passengers: Number(e.target.value) })}
                    className="w-full p-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-fern"
                    placeholder="1"
                    min="1"
                  />
                </div>

                {newEntry.distance > 0 && newEntry.passengers > 0 && (
                  <div className="p-3 bg-fern/10 rounded-lg">
                    <p className="text-sm text-fern font-semibold">
                      CO₂ Emissions: {calculateCarbon(newEntry.type, newEntry.distance, newEntry.passengers).toFixed(2)} kg
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={addEntry}
                    disabled={loading}
                    className="flex-1 bg-fern text-white py-3 rounded-lg font-semibold hover:bg-moss transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Add Entry'}
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

          {/* Entries List */}
          {entries.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-ink">Your Trips</h3>
              <div className="space-y-3">
                {entries.map((entry, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg border border-ink/10 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-ink">
                        {entry.type === 'flight' && '✈️'}
                        {entry.type === 'car' && '🚗'}
                        {entry.type === 'train' && '🚂'}
                        {entry.type === 'bus' && '🚌'}
                        {' '}{entry.distance} km ({entry.passengers} {entry.passengers === 1 ? 'person' : 'people'})
                      </p>
                      <p className="text-sm text-mid">{entry.carbon.toFixed(2)} kg CO₂</p>
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
              <p className="text-mid mb-4">No trips recorded yet</p>
              <p className="text-sm text-sage">Start tracking your travel impact by adding your first trip</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
