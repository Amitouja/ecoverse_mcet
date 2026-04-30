'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { SuccessMessage } from '@/app/components/SuccessMessage';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  eco_score: number;
  tag: 'ORGANIC' | 'RECYCLED' | 'VEGAN';
  stock: number;
  full_description?: string;
  eco_benefits?: string[];
}

const PRODUCTS_DATA: { [key: number]: Product } = {
  1: {
    id: 1,
    name: 'Organic Linen Tee',
    description: '100% Organic Cotton',
    price: 1299,
    image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=85',
    eco_score: 95,
    tag: 'ORGANIC',
    stock: 15,
    full_description:
      'Our premium organic linen tee is crafted from 100% certified organic cotton grown without harmful pesticides. Perfect for everyday wear, this tee combines comfort with eco-consciousness.',
    eco_benefits: ['No harmful pesticides', 'Fair trade certified', 'Biodegradable', 'Water efficient'],
  },
  2: {
    id: 2,
    name: 'Recycled Bomber',
    description: 'Post-Consumer Polyester',
    price: 3499,
    image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=85',
    eco_score: 88,
    tag: 'RECYCLED',
    stock: 8,
    full_description:
      'Made from 12 recycled plastic bottles, this bomber jacket gives new life to waste. Stylish, durable, and environmentally responsible.',
    eco_benefits: ['12 plastic bottles recycled', '40% less water', 'Reduced carbon footprint', 'Premium quality'],
  },
  3: {
    id: 3,
    name: 'Hemp Canvas Kicks',
    description: 'Natural Hemp Fibre',
    price: 2799,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85',
    eco_score: 91,
    tag: 'VEGAN',
    stock: 12,
    full_description: 'Comfortable hemp canvas sneakers that require zero animal products. Perfect for the conscious consumer.',
    eco_benefits: ['100% vegan', 'Hemp based', 'Durable soles', 'Sustainable production'],
  },
  4: {
    id: 4,
    name: 'Bamboo Joggers',
    description: 'Organic Bamboo Blend',
    price: 1899,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=85',
    eco_score: 86,
    tag: 'ORGANIC',
    stock: 20,
    full_description:
      'Soft, breathable bamboo joggers that feel amazing. Bamboo grows rapidly without fertilizers, making it the ultimate sustainable fabric.',
    eco_benefits: ['Fast growing bamboo', 'Minimal water usage', 'Naturally antibacterial', 'Ultra soft'],
  },
  5: {
    id: 5,
    name: 'Cactus Leather Jacket',
    description: 'Nopal Cactus Leather',
    price: 5999,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=85',
    eco_score: 82,
    tag: 'VEGAN',
    stock: 5,
    full_description:
      'Revolutionary cactus leather that requires zero animal products. A statement piece for the eco-warrior. Get one before they sell out!',
    eco_benefits: ['100% vegan', 'Water intensive cactus farming eliminated', 'Durable material', 'Luxury quality'],
  },
  6: {
    id: 6,
    name: 'Hemp Maxi Dress',
    description: 'Hemp & TENCEL™ Blend',
    price: 2499,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=85',
    eco_score: 93,
    tag: 'ORGANIC',
    stock: 10,
    full_description: 'Elegant maxi dress perfect for any occasion. Made from premium hemp and TENCEL™ for ultimate comfort and sustainability.',
    eco_benefits: ['Hemp & TENCEL blend', 'Elegant design', 'Breathable fabric', 'Sustainable dyes'],
  },
  7: {
    id: 7,
    name: 'Recycled Denim',
    description: 'Post-Consumer Denim',
    price: 2199,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=85',
    eco_score: 87,
    tag: 'RECYCLED',
    stock: 18,
    full_description: 'Classic recycled denim that looks and feels like new. Support circular fashion with every wear.',
    eco_benefits: ['Recycled denim fibers', 'Water saved', 'Waste diverted', 'Timeless style'],
  },
  8: {
    id: 8,
    name: 'Cork Crossbody',
    description: 'Sustainable Cork Bark',
    price: 1699,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=85',
    eco_score: 94,
    tag: 'VEGAN',
    stock: 14,
    full_description: 'Lightweight cork crossbody bag that is waterproof, durable, and completely cruelty-free.',
    eco_benefits: ['Cork bark harvested sustainably', '100% vegan', 'Waterproof', 'Lightweight & durable'],
  },
};

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const productId = parseInt(params.id as string);
  const product = PRODUCTS_DATA[productId];

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await addToCart(product.id, quantity);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setQuantity(1);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await addToCart(product.id, quantity);
      setTimeout(() => router.push('/cart'), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to proceed');
    } finally {
      setLoading(false);
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'ORGANIC':
        return 'bg-green-100 text-green-800';
      case 'RECYCLED':
        return 'bg-blue-100 text-blue-800';
      case 'VEGAN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-8"
        >
          ← Back to Products
        </Link>

        {/* Success Message */}
        {success && <SuccessMessage message={`${product.name} added to cart!`} onClose={() => setSuccess(false)} />}
        {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${getTagColor(product.tag)}`}>
                {product.tag}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-6">{product.description}</p>

            {/* Full Description */}
            <p className="text-gray-700 mb-8 leading-relaxed">{product.full_description}</p>

            {/* Eco Score */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Eco Score</h3>
                <span className="text-3xl font-bold text-green-600">{product.eco_score}/100</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${product.eco_score}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                This product has a high environmental score and supports sustainable practices.
              </p>
            </div>

            {/* Eco Benefits */}
            {product.eco_benefits && (
              <div className="bg-white rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🌱 Eco Benefits</h3>
                <ul className="space-y-2">
                  {product.eco_benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-green-600 mr-3">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price and Actions */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <div className="mb-6">
                <h3 className="text-gray-600 text-sm mb-2">Price</h3>
                <p className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-medium">
                    ✓ In Stock ({product.stock} available)
                  </p>
                ) : (
                  <p className="text-red-600 font-medium">✗ Out of Stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                      className="w-12 text-center border-0 py-2 focus:ring-0"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={loading || product.stock === 0}
                  className={`w-full px-6 py-3 rounded-lg font-medium text-lg transition-all ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                  }`}
                >
                  {loading ? 'Adding...' : 'Add to Cart'}
                </button>
                {product.stock > 0 && (
                  <button
                    onClick={handleBuyNow}
                    disabled={loading}
                    className="w-full px-6 py-3 rounded-lg font-medium text-lg bg-white text-green-600 border-2 border-green-600 hover:bg-green-50 transition-all active:scale-95"
                  >
                    {loading ? 'Processing...' : 'Buy Now'}
                  </button>
                )}
              </div>
            </div>

            {/* Eco Points */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <p className="text-green-800">
                <span className="font-bold">Earn {Math.round(product.price / 50)} Eco Points</span> on this purchase!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
