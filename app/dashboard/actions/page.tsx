'use client';

import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

export default function ActionsPage() {
  const { profile } = useAuth();

  const actions = [
    {
      title: '✈️ Track Travel',
      description: 'Log your flights, car rides, and commutes',
      link: '/travel',
      help: 'Calculate carbon emissions from your transportation',
    },
    {
      title: '⚡ Track Energy',
      description: 'Monitor your electricity consumption',
      link: '/electricity',
      help: 'Track monthly energy usage and benefits',
    },
    {
      title: '🤖 AI Predictions',
      description: 'Get personalized carbon footprint insights',
      link: '/ml-results',
      help: 'Use ML to predict and optimize your impact',
    },
    {
      title: '🛍️ Eco Shopping',
      description: 'Browse sustainable products',
      link: '/',
      help: 'Earn Eco Points with every purchase',
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Actions</h1>
      <p className="text-gray-600 mb-8">
        Reduce your carbon footprint and earn Eco Points! Your current balance: <span className="font-bold text-green-600">{profile?.eco_points}</span> points
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            href={action.link}
            className="block bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:scale-105 transition transform"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-gray-600 mb-4">{action.description}</p>
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-green-700">💡 {action.help}</p>
            </div>
            <button className="text-green-600 font-semibold hover:text-green-700">
              Get Started →
            </button>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Earn More Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl mb-2">🛍️</div>
            <h3 className="font-bold text-gray-900 mb-2">Shop Sustainably</h3>
            <p className="text-gray-600 text-sm">Each eco-friendly purchase earns points</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🚶</div>
            <h3 className="font-bold text-gray-900 mb-2">Track Actions</h3>
            <p className="text-gray-600 text-sm">Log your sustainable choices daily</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-bold text-gray-900 mb-2">Build Streaks</h3>
            <p className="text-gray-600 text-sm">Bonus points for consistent actions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
