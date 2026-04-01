'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { SuccessMessage } from '@/app/components/SuccessMessage';
import { ErrorMessage } from '@/app/components/ErrorMessage';

export default function FormPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in first' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('submissions').insert([
        {
          user_id: user.id,
          ...formData,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Form submitted successfully!' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to submit form',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit Your Feedback</h1>

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700">
              Please{' '}
              <a href="/login" className="underline font-semibold">
                sign in
              </a>{' '}
              to submit a form.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
              <option>general</option>
              <option>feedback</option>
              <option>suggestion</option>
              <option>bug-report</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Enter your message"
            />
          </div>

          {message && (
            <>
              {message.type === 'success' ? (
                <SuccessMessage message={message.text} onClose={() => setMessage(null)} />
              ) : (
                <ErrorMessage message={message.text} onClose={() => setMessage(null)} />
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading || !user}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Submit Form'}
          </button>
        </form>
      </div>
    </div>
  );
}
