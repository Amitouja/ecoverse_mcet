'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { SuccessMessage } from '@/app/components/SuccessMessage';

interface CheckoutData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCVV: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { cart, getTotal, clearCart, getItemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Billing, 3: Review

  const [formData, setFormData] = useState<CheckoutData>({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to checkout.</p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add items to your cart before checkout.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShippingForm = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all shipping details');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const validateBillingForm = () => {
    if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCVV) {
      setError('Please fill in all card details');
      return false;
    }
    if (!/^\d{16}$/.test(formData.cardNumber)) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      setError('Please enter card expiry in MM/YY format');
      return false;
    }
    if (!/^\d{3}$/.test(formData.cardCVV)) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError(null);
    if (currentStep === 1 && validateShippingForm()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateBillingForm()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total: getTotal() + Math.round(getTotal() * 0.1),
            status: 'completed',
            shipping_address: {
              fullName: formData.fullName,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            },
            billing_address: {
              cardName: formData.cardName,
              cardLast4: formData.cardNumber.slice(-4),
            },
            items: cart.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.product?.price || 0,
            })),
          },
        ])
        .select();

      if (orderError) throw orderError;

      // Update user eco points
      const ecoPointsEarned = Math.round(getTotal() / 50);
      const { error: updateError } = await supabase
        .from('users')
        .update({
          eco_points: (profile?.eco_points || 0) + ecoPointsEarned,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Clear cart
      await clearCart();

      // Show success message
      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/order-confirmation/${order?.[0]?.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const total = getTotal();
  const tax = Math.round(total * 0.1);
  const finalTotal = total + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        {success && (
          <SuccessMessage
            message="Order placed successfully! Redirecting..."
            onClose={() => setSuccess(false)}
          />
        )}
        {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[
                  { step: 1, label: 'Shipping' },
                  { step: 2, label: 'Billing' },
                  { step: 3, label: 'Review' },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        currentStep >= item.step
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {item.step}
                    </div>
                    <span
                      className={`ml-2 font-medium ${
                        currentStep >= item.step ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {item.label}
                    </span>
                    {index < 2 && (
                      <div
                        className={`w-12 h-1 ml-4 ${
                          currentStep > item.step ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="9876543210"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="Mumbai"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="Maharashtra"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="400001"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="mt-8">
                  <button
                    onClick={handleNextStep}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all"
                  >
                    Continue to Billing
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Billing Information */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>

                <div className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').slice(0, 16);
                        setFormData((prev) => ({
                          ...prev,
                          cardNumber: value,
                        }));
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="1234 5678 9012 3456"
                      maxLength="16"
                    />
                  </div>

                  {/* Card Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="12/25"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cardCVV"
                        value={formData.cardCVV}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setFormData((prev) => ({
                            ...prev,
                            cardCVV: value,
                          }));
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      🔒 This is a demo. Use test card: <span className="font-bold">4242 4242 4242 4242</span>
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>

                {/* Shipping Summary */}
                <div className="mb-8 pb-8 border-b-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="text-gray-700 space-y-1">
                    <p className="font-medium">{formData.fullName}</p>
                    <p>{formData.address}</p>
                    <p>
                      {formData.city}, {formData.state} {formData.pincode}
                    </p>
                    <p>{formData.phone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8 pb-8 border-b-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.product?.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Tax (10%)</span>
                      <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t-2 border-green-300 pt-3 flex items-center justify-between text-lg">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{finalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-2 flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Eco Points */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-bold">Earn {Math.round(total / 50)} Eco Points</span> on
                  this order!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
