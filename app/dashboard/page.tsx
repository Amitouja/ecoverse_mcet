'use client';

import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

interface Stats {
  totalPoints: number;
  carbonFootprint: number;
  productsOwned: number;
  treesSaved: number;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalPoints: 0,
    carbonFootprint: 0,
    productsOwned: 0,
    treesSaved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchStats();
    }
  }, [profile?.id]);

  const fetchStats = async () => {
    try {
      // Fetch user purchase count
      const { count: purchaseCount } = await supabase
        .from('purchases')
        .select('*', { count: 'exact' })
        .eq('user_id', profile?.id);

      // Fetch total footprints
      const { data: footprints } = await supabase
        .from('footprints')
        .select('carbon_footprint')
        .eq('user_id', profile?.id);

      const totalCarbon = footprints?.reduce((sum, item) => sum + (item.carbon_footprint || 0), 0) || 0;

      setStats({
        totalPoints: profile?.eco_points || 0,
        carbonFootprint: totalCarbon,
        productsOwned: purchaseCount || 0,
        treesSaved: Math.floor(totalCarbon / 20),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome back, {profile?.full_name}! 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-600 mb-2">Eco Points</div>
          <div className="text-3xl font-bold text-green-600">{stats.totalPoints}</div>
          <div className="text-xs text-gray-500 mt-2">Points earned</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-600 mb-2">Carbon Footprint</div>
          <div className="text-3xl font-bold text-blue-600">{stats.carbonFootprint.toFixed(1)}</div>
          <div className="text-xs text-gray-500 mt-2">kg CO₂ tracked</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-600 mb-2">Products Owned</div>
          <div className="text-3xl font-bold text-purple-600">{stats.productsOwned}</div>
          <div className="text-xs text-gray-500 mt-2">Sustainable items</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-600 mb-2">Trees Saved</div>
          <div className="text-3xl font-bold text-green-500">{stats.treesSaved}</div>
          <div className="text-xs text-gray-500 mt-2">CO₂ offset</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Track your sustainable shopping and carbon progress here!</p>
        </div>
      </div>
    </div>
  );
}
