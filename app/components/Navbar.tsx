'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

const ThemeToggle = dynamic(() => import('./ThemeToggle').then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => <div className="w-10 h-10" />,
});

export function Navbar() {
  const { user, profile, logout } = useAuth();
  const { getItemCount } = useCart();
  const router = useRouter();
  const cartCount = getItemCount();

  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
            🌿 EcoVerse
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center text-sm md:text-base overflow-x-auto">
            <Link href="/shop" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium whitespace-nowrap">
              Shop
            </Link>
            <Link href="/eco-ranks" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium whitespace-nowrap">
              Eco Ranks
            </Link>
            <Link href="/rewards" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium whitespace-nowrap">
              Rewards
            </Link>
            <Link href="/ai-stylist" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium whitespace-nowrap">
              AI Stylist
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium whitespace-nowrap">
                  Dashboard
                </Link>
                <Link href="/travel" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium whitespace-nowrap">
                  Travel
                </Link>
                <Link href="/electricity" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium whitespace-nowrap">
                  Energy
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Auth & Cart & Theme */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            {user ? (
              <>
                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition text-2xl"
                >
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User Info */}
                <div className="hidden md:flex items-center gap-3 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{profile?.full_name}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{profile?.eco_points} pts</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition font-medium text-sm md:text-base">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 dark:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition font-medium text-sm md:text-base"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
