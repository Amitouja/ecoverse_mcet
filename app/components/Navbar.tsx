'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';

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
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600 whitespace-nowrap">
            🌿 EcoVerse
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-8 flex-1 justify-center">
            <Link href="/shop" className="text-gray-700 hover:text-green-600 transition font-medium">
              Shop
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition font-medium">
                  Dashboard
                </Link>
                <Link href="/travel" className="text-gray-700 hover:text-green-600 transition font-medium">
                  Travel
                </Link>
                <Link href="/electricity" className="text-gray-700 hover:text-green-600 transition font-medium">
                  Energy
                </Link>
              </>
            )}
          </div>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Cart Icon */}
                <Link
                  href="/cart"
                  className="relative text-gray-700 hover:text-green-600 transition text-2xl"
                >
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 border-l-2 border-gray-200 pl-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{profile?.full_name}</p>
                    <p className="text-xs text-green-600">{profile?.eco_points} pts</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-green-600 transition font-medium">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
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
