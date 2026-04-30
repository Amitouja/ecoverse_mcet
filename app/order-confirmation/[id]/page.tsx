'use client';

import Link from 'next/link';

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 text-lg mb-2">Thank you for your purchase</p>
        <p className="text-gray-600 mb-8">
          Your order has been placed successfully. You'll receive an email confirmation shortly with your tracking information.
        </p>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-green-800">
            <span className="font-bold">🌱 Eco Points Earned!</span> Check your profile to see your rewards.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
          >
            View Dashboard
          </Link>
          <Link
            href="/shop"
            className="block px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
