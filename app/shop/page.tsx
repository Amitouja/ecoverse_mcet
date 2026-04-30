'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
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
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Organic Linen Tee',
    description: '100% Organic Cotton',
    price: 1299,
    image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=85',
    eco_score: 95,
    tag: 'ORGANIC',
    stock: 15,
  },
  {
    id: 2,
    name: 'Recycled Bomber',
    description: 'Post-Consumer Polyester',
    price: 3499,
    image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=85',
    eco_score: 88,
    tag: 'RECYCLED',
    stock: 8,
  },
  {
    id: 3,
    name: 'Hemp Canvas Kicks',
    description: 'Natural Hemp Fibre',
    price: 2799,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85',
    eco_score: 91,
    tag: 'VEGAN',
    stock: 12,
  },
  {
    id: 4,
    name: 'Bamboo Joggers',
    description: 'Organic Bamboo Blend',
    price: 1899,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=85',
    eco_score: 86,
    tag: 'ORGANIC',
    stock: 20,
  },
  {
    id: 5,
    name: 'Cactus Leather Jacket',
    description: 'Nopal Cactus Leather',
    price: 5999,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=85',
    eco_score: 82,
    tag: 'VEGAN',
    stock: 5,
  },
  {
    id: 6,
    name: 'Hemp Maxi Dress',
    description: 'Hemp & TENCEL™ Blend',
    price: 2499,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=85',
    eco_score: 93,
    tag: 'ORGANIC',
    stock: 10,
  },
  {
    id: 7,
    name: 'Recycled Denim',
    description: 'Post-Consumer Denim',
    price: 2199,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=85',
    eco_score: 87,
    tag: 'RECYCLED',
    stock: 18,
  },
  {
    id: 8,
    name: 'Cork Crossbody',
    description: 'Sustainable Cork Bark',
    price: 1699,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=85',
    eco_score: 94,
    tag: 'VEGAN',
    stock: 14,
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await addToCart(product.id, 1);
      setSuccess(`${product.name} added to cart!`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTag === 'ALL') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.tag === selectedTag));
    }
  }, [selectedTag, products]);

  const tags = ['ALL', 'ORGANIC', 'RECYCLED', 'VEGAN'];
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sustainable Fashion Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover our curated collection of eco-friendly clothing and accessories
          </p>
        </div>

        {/* Filter Tags */}
        <div className="mb-8 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Success/Error Messages */}
        {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
        {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* Product Image */}
              <Link href={`/shop/products/${product.id}`} className="block overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                />
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link
                    href={`/shop/products/${product.id}`}
                    className="hover:text-green-600 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  </Link>
                  <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${getTagColor(product.tag)}`}>
                    {product.tag}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-1">{product.description}</p>

                {/* Eco Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Eco Score</span>
                    <span className="text-sm font-bold text-green-600">{product.eco_score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${product.eco_score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loading || product.stock === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                    }`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>

                {product.stock < 5 && product.stock > 0 && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">Only {product.stock} left!</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No products found in this category</p>
            <button
              onClick={() => setSelectedTag('ALL')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
