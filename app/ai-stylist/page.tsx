'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

interface StyleRecommendation {
  id: number;
  name: string;
  description: string;
  eco_score: number;
  tag: string;
  image: string;
  price: number;
  material: string;
  why_recommended: string;
}

export default function AIStylistPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const styleOptions = ['Casual', 'Formal', 'Athletic', 'Bohemian', 'Minimalist'];
  const occasionOptions = ['Daily Wear', 'Office', 'Party', 'Gym', 'Weekend'];

  const mockRecommendations: StyleRecommendation[] = [
    {
      id: 1,
      name: 'Organic Linen Tee',
      description: '100% Organic Cotton',
      eco_score: 95,
      tag: 'ORGANIC',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=85',
      price: 1299,
      material: '100% Organic Cotton',
      why_recommended: 'Perfect for casual everyday wear. Breathable and sustainable material.',
    },
    {
      id: 2,
      name: 'Recycled Bomber',
      description: 'Post-Consumer Polyester',
      eco_score: 88,
      tag: 'RECYCLED',
      image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=85',
      price: 3499,
      material: 'Post-Consumer Polyester',
      why_recommended: 'Great layering piece made from recycled materials.',
    },
    {
      id: 3,
      name: 'Hemp Canvas Kicks',
      description: 'Natural Hemp Fibre',
      eco_score: 91,
      tag: 'VEGAN',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85',
      price: 2799,
      material: 'Natural Hemp Fibre',
      why_recommended: 'Eco-friendly sneakers that complement any casual outfit.',
    },
    {
      id: 4,
      name: 'Bamboo Joggers',
      description: 'Organic Bamboo Blend',
      eco_score: 86,
      tag: 'ORGANIC',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=85',
      price: 1899,
      material: 'Organic Bamboo Blend',
      why_recommended: 'Ultra-comfortable for casual or athletic wear.',
    },
  ];

  const handleGetRecommendations = async () => {
    if (!style || !occasion) {
      alert('Please select both style and occasion');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // Simulate API call
    setTimeout(() => {
      // Filter mock recommendations based on selections
      const filtered =
        style === 'Athletic' || occasion === 'Gym'
          ? mockRecommendations.filter((r) => r.name.includes('Joggers') || r.name.includes('Kicks'))
          : mockRecommendations;

      setRecommendations(filtered);
      setLoading(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Please log in to use the AI Stylist feature
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            ✨ AI Stylist - Eco Fashion Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get personalized sustainable outfit recommendations based on your style and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Find Your Style 👗
              </h2>

              {/* Style Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Style Preference
                </label>
                <div className="space-y-2">
                  {styleOptions.map((s) => (
                    <label key={s} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="style"
                        value={s}
                        checked={style === s}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasion Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Occasion
                </label>
                <div className="space-y-2">
                  {occasionOptions.map((o) => (
                    <label key={o} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="occasion"
                        value={o}
                        checked={occasion === o}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{o}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Get Recommendations Button */}
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Finding matches...' : '🔍 Get Recommendations'}
              </button>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Our AI analyzes eco-friendly products that match your style and occasion perfectly.
                </p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {loading && <LoadingSpinner />}

            {!hasSearched && !loading && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-2xl mb-2">👕👔👗</p>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Select your style and occasion to get personalized recommendations
                </p>
              </div>
            )}

            {hasSearched && !loading && recommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Recommended for you 💚
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <img
                          src={rec.image}
                          alt={rec.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ECO {rec.eco_score}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {rec.name}
                          </h3>
                          <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {rec.tag}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {rec.material}
                        </p>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 italic">
                          {rec.why_recommended}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ₹{rec.price.toLocaleString()}
                          </span>
                          <button className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200 font-medium">
                            View & Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasSearched && !loading && recommendations.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No recommendations found for this combination. Try different options!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Why Use AI Stylist? 🤖
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Personalized Matches
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get curated suggestions based on your unique style and lifestyle
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Eco-Friendly Only
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every recommendation is sustainably made and carbon-conscious
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Earn Rewards
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get eco points on every purchase and unlock premium rewards
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
