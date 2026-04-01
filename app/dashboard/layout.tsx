'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-green-600 text-white p-8 overflow-y-auto">
        <Link href="/" className="text-2xl font-bold mb-12 block hover:opacity-90">
          🌿 EcoVerse
        </Link>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            📊 Overview
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            👤 Profile
          </Link>
          <Link
            href="/dashboard/progress"
            className="block px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            📈 Progress
          </Link>
          <Link
            href="/dashboard/actions"
            className="block px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            ⚡ Actions
          </Link>
          <Link
            href="/travel"
            className="block px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            ✈️ Travel Impact
          </Link>
          <Link
            href="/electricity"
            className="block px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            ⚡ Energy Usage
          </Link>
        </nav>

        <div className="absolute bottom-8 left-8 right-8">
          <button
            onClick={async () => {
              const { signOut } = await import('@/app/lib/supabase');
              await signOut();
              router.push('/');
            }}
            className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
