'use client';

import { supabase } from '@/app/lib/supabase';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  created_at: string;
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();

      if (error && error.code !== 'PGRST116') throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link href="/learn" className="text-green-600 hover:underline font-semibold">
            Back to Learning Center
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {article.image_url && (
          <img src={article.image_url} alt={article.title} className="w-full h-96 object-cover rounded-lg mb-8" />
        )}

        <div className="bg-white rounded-lg p-8 shadow-md">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {article.category}
          </span>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

          <p className="text-gray-600 text-sm mb-8">
            Published {new Date(article.created_at).toLocaleDateString()}
          </p>

          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap mb-8">{article.content}</div>

          <div className="border-t pt-8">
            <Link href="/learn" className="text-green-600 hover:underline font-semibold">
              ← Back to Learning Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
