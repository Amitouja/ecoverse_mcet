'use client';

import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { SuccessMessage } from '@/app/components/SuccessMessage';
import { ErrorMessage } from '@/app/components/ErrorMessage';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <div className="max-w-2xl bg-white rounded-lg p-8 shadow-md">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
              Avatar URL
            </label>
            <input
              id="avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="https://example.com/avatar.jpg"
            />
            {avatarUrl && (
              <img src={avatarUrl} alt="Avatar" className="mt-4 w-32 h-32 rounded-full object-cover" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Eco Points</p>
              <p className="text-lg font-semibold text-green-600">{profile.eco_points}</p>
            </div>
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
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
