'use client';

import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import Link from 'next/link';

interface ProgressData {
  date: string;
  carbon: number;
  points: number;
}

export default function ProgressPage() {
  const { profile } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProgress, setTotalProgress] = useState({
    carbonReduced: 0,
    pointsEarned: 0,
    purchasesMade: 0,
  });

  useEffect(() => {
    if (profile?.id) {
      fetchProgress();
    }
  }, [profile?.id]);

  const fetchProgress = async () => {
    try {
      // Fetch carbon footprints
      const { data: footprints } = await supabase
        .from('footprints')
        .select('carbon_footprint, created_at')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (footprints) {
        setProgressData(
          footprints.map((f) => ({
            date: new Date(f.created_at).toLocaleDateString(),
            carbon: f.carbon_footprint,
            points: Math.floor(f.carbon_footprint * 0.5),
          }))
        );

        setTotalProgress({
          carbonReduced: footprints.reduce((sum, f) => sum + f.carbon_footprint, 0),
          pointsEarned: profile?.eco_points || 0,
          purchasesMade: footprints.length,
        });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg p-6 shadow-md">
          <div className="text-sm opacity-90 mb-2">Carbon Reduced</div>
          <div className="text-4xl font-bold">{totalProgress.carbonReduced.toFixed(1)}</div>
          <div className="text-xs opacity-75 mt-2">kg CO₂ tracked</div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg p-6 shadow-md">
          <div className="text-sm opacity-90 mb-2">Points Earned</div>
          <div className="text-4xl font-bold">{totalProgress.pointsEarned}</div>
          <div className="text-xs opacity-75 mt-2">Eco Points</div>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg p-6 shadow-md">
          <div className="text-sm opacity-90 mb-2">Actions Taken</div>
          <div className="text-4xl font-bold">{totalProgress.purchasesMade}</div>
          <div className="text-xs opacity-75 mt-2">Sustainability actions</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

        {progressData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No activity yet. Start tracking your sustainability!</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/travel"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Track Travel
              </Link>
              <Link
                href="/electricity"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Track Energy
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {progressData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{item.date}</p>
                  <p className="text-sm text-gray-600">{item.carbon.toFixed(2)} kg CO₂</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+{item.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
