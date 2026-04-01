'use client';

import { supabase } from '@/app/lib/supabase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
}

export default function LearnPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Learn About Sustainability 🌱</h1>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No articles yet. Stay tuned for sustainability tips!</p>
            <Link href="/dashboard" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/learn/${article.slug}`} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                {article.image_url && (
                  <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {article.category}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm">{article.excerpt}</p>
                  <div className="mt-4 text-green-600 font-semibold">Read more →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
