'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

interface RankedUser {
  rank: number;
  email: string;
  full_name: string;
  eco_points: number;
  eco_rank: string;
  carbon_saved: number;
}

const ecoRankInfo: { [key: string]: { emoji: string; level: number; threshold: number } } = {
  SEED: { emoji: '🌱', level: 1, threshold: 0 },
  SAPLING: { emoji: '🌿', level: 2, threshold: 500 },
  TREE: { emoji: '🌳', level: 3, threshold: 1500 },
  FOREST_GUARDIAN: { emoji: '🌍', level: 4, threshold: 5000 },
};

export default function EcoRanksPage() {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<RankedUser | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Mock data - in production this would fetch from Supabase
        const mockLeaderboard: RankedUser[] = [
          {
            rank: 1,
            email: 'eco@example.com',
            full_name: 'Eco Warrior',
            eco_points: 8500,
            eco_rank: 'FOREST_GUARDIAN',
            carbon_saved: 450,
          },
          {
            rank: 2,
            email: 'green@example.com',
            full_name: 'Green Champion',
            eco_points: 6200,
            eco_rank: 'FOREST_GUARDIAN',
            carbon_saved: 380,
          },
          {
            rank: 3,
            email: 'nature@example.com',
            full_name: 'Nature Lover',
            eco_points: 4800,
            eco_rank: 'TREE',
            carbon_saved: 300,
          },
          {
            rank: 4,
            email: 'sustainable@example.com',
            full_name: 'Sustainable Sarah',
            eco_points: 3200,
            eco_rank: 'TREE',
            carbon_saved: 220,
          },
          {
            rank: 5,
            email: 'eco-friend@example.com',
            full_name: 'Eco Friend',
            eco_points: 2100,
            eco_rank: 'SAPLING',
            carbon_saved: 150,
          },
          {
            rank: 6,
            email: 'green-starter@example.com',
            full_name: 'Green Starter',
            eco_points: 1800,
            eco_rank: 'SAPLING',
            carbon_saved: 120,
          },
          {
            rank: 7,
            email: 'eco-beginner@example.com',
            full_name: 'Eco Beginner',
            eco_points: 600,
            eco_rank: 'SAPLING',
            carbon_saved: 50,
          },
          {
            rank: 8,
            email: 'growing@example.com',
            full_name: 'Growing Green',
            eco_points: 350,
            eco_rank: 'SEED',
            carbon_saved: 30,
          },
        ];

        setLeaderboard(mockLeaderboard);

        // Find current user's rank (if they exist in the list)
        if (profile) {
          const userRankData = mockLeaderboard.find((u) => u.email === profile.email);
          if (!userRankData) {
            setUserRank({
              rank: mockLeaderboard.length + 1,
              email: profile.email,
              full_name: profile.full_name,
              eco_points: profile.eco_points,
              eco_rank: profile.eco_rank,
              carbon_saved: profile.carbon_footprint || 0,
            });
          } else {
            setUserRank(userRankData);
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [profile]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            🏆 Eco Ranks Leaderboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Compete with eco-warriors globally and climb the sustainability ladder
          </p>
        </div>

        {/* Rank Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {Object.entries(ecoRankInfo).map(([rank, info]) => (
            <div
              key={rank}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border-2 border-transparent hover:border-green-400 dark:hover:border-green-600 transition"
            >
              <div className="text-4xl mb-2">{info.emoji}</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{rank}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {info.threshold.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="mb-12 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-6 border-2 border-yellow-300 dark:border-yellow-600">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              📍 Your Current Rank
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">
                  {ecoRankInfo[userRank.eco_rank]?.emoji || '🌱'}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    #{userRank.rank}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {userRank.full_name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {userRank.eco_points.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Eco Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    User
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Eco Level
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Points
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                    Carbon Saved (kg)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((user, index) => (
                  <tr
                    key={user.email}
                    className={`transition-colors ${
                      index < 3
                        ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10 dark:to-transparent'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        {index === 0 && <span className="text-2xl">🥇</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        {index > 2 && (
                          <span className="font-bold text-gray-600 dark:text-gray-400">
                            #{user.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user.full_name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">
                          {ecoRankInfo[user.eco_rank]?.emoji || '🌱'}
                        </span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {user.eco_rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {user.eco_points.toLocaleString()} pts
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {user.carbon_saved.toLocaleString()} kg
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rank Benefits Info */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🎁 Rank Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-green-400">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌱</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Seed (0-499 pts)</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Get started with +5% bonus points on all purchases</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌿</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sapling (500-1499 pts)</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Unlock free eco-packaging on all your orders</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌳</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tree (1500-4999 pts)</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Get priority scratch cards and exclusive access</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-green-700">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌍</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Forest Guardian (5000+ pts)</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Enjoy 20% discount + VIP treatment & exclusive drops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
