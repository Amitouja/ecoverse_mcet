'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const { signOut } = await import('@/app/lib/supabase');
    await signOut();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-600">
          🌿 EcoVerse
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition">
                Dashboard
              </Link>
              <Link href="/travel" className="text-gray-700 hover:text-green-600 transition">
                Travel
              </Link>
              <Link href="/electricity" className="text-gray-700 hover:text-green-600 transition">
                Energy
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
                  <p className="text-xs text-green-600">{profile?.eco_points} pts</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-green-600 transition">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
