'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { ErrorMessage } from '@/app/components/ErrorMessage';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, loading, error, removeFromCart, updateQuantity, getTotal, getItemCount } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your cart.</p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleRemoveItem = async (id: string) => {
    try {
      setRemovingId(id);
      await removeFromCart(id);
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateQuantity(id, quantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 text-lg mb-8">
              Start shopping to add items to your cart
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const itemCount = getItemCount();
  const tax = Math.round(total * 0.1); // 10% tax
  const finalTotal = total + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {error && <ErrorMessage error={error} onClose={() => {}} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b-2 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {itemCount} Item{itemCount !== 1 ? 's' : ''} in Cart
                </h2>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.product?.image_url || 'https://via.placeholder.com/100'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.product?.name || 'Unknown Product'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded ${
                                  item.product?.tag === 'ORGANIC'
                                    ? 'bg-green-100 text-green-800'
                                    : item.product?.tag === 'RECYCLED'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {item.product?.tag}
                              </span>
                              {item.product?.eco_score && (
                                <span className="text-xs text-gray-600">
                                  Eco Score: {item.product.eco_score}/100
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removingId === item.id}
                            className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                          >
                            {removingId === item.id ? 'Removing...' : 'Remove'}
                          </button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center border-2 border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                              disabled={loading}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                              }
                              min="1"
                              className="w-12 text-center border-0 py-2 focus:ring-0"
                              disabled={loading}
                            />
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                              disabled={loading}
                            >
                              +
                            </button>
                          </div>

                          {/* Item Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{(item.product?.price || 0).toLocaleString('en-IN')} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
                <Link
                  href="/shop"
                  className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Summary Items */}
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold text-gray-900">
                    ₹{tax.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  <span className="font-bold">Earn {Math.round(total / 50)} Eco Points</span> on
                  this order!
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              {/* Info */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-gray-600">Free shipping on orders over ₹5000</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-gray-600">Secure checkout with encryption</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-gray-600">30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
