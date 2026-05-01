'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

interface Reward {
  id: string;
  reward_type: string;
  reward_value: string;
  reward_amount: number;
  is_claimed: boolean;
  created_at: string;
}

export default function RewardsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [scratchedCards, setScratchedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchRewards = async () => {
      try {
        // For now, use mock data. In production, fetch from Supabase
        const mockRewards: Reward[] = [
          {
            id: '1',
            reward_type: 'DISCOUNT',
            reward_value: '10% OFF',
            reward_amount: 0,
            is_claimed: false,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            reward_type: 'CASHBACK',
            reward_value: '₹50 Cashback',
            reward_amount: 50,
            is_claimed: false,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            reward_type: 'POINTS',
            reward_value: '2x Points',
            reward_amount: 0,
            is_claimed: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '4',
            reward_type: 'COUPON',
            reward_value: 'Free Shipping',
            reward_amount: 0,
            is_claimed: false,
            created_at: new Date().toISOString(),
          },
        ];
        setRewards(mockRewards);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [user, router]);

  const handleScratch = (rewardId: string) => {
    setScratchedCards((prev) => new Set([...prev, rewardId]));
  };

  const handleClaimReward = (rewardId: string) => {
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === rewardId ? { ...reward, is_claimed: true } : reward
      )
    );
  };

  if (loading) return <LoadingSpinner />;

  const unclaimedRewards = rewards.filter((r) => !r.is_claimed);
  const claimedRewards = rewards.filter((r) => r.is_claimed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            🎁 Your Rewards
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Unlock scratch cards and claim amazing rewards for your eco-friendly choices!
          </p>
        </div>

        {/* Unclaimed Rewards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            💎 Available Rewards ({unclaimedRewards.length})
          </h2>
          {unclaimedRewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unclaimedRewards.map((reward) => (
                <ScratchCard
                  key={reward.id}
                  reward={reward}
                  isScratched={scratchedCards.has(reward.id)}
                  onScratch={() => handleScratch(reward.id)}
                  onClaim={() => handleClaimReward(reward.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No available rewards yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Make purchases or complete eco-actions to unlock rewards!
              </p>
            </div>
          )}
        </div>

        {/* Claimed Rewards */}
        {claimedRewards.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              ✅ Claimed Rewards ({claimedRewards.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500 opacity-75"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Claimed {new Date(reward.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {reward.reward_value}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">
                    ✓ CLAIMED
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScratchCard({
  reward,
  isScratched,
  onScratch,
  onClaim,
}: {
  reward: Reward;
  isScratched: boolean;
  onScratch: () => void;
  onClaim: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const scratchPercentage = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw scratch layer
    ctx.fillStyle = '#9CA3AF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch to reveal!', canvas.width / 2, canvas.height / 2);

    // Set up scratch effect
    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratched) return;
    setIsDrawing(true);
    scratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isScratched) return;
    scratch(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let scratchPixels = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) scratchPixels++;
    }
    const percentage = (scratchPixels / (canvas.width * canvas.height)) * 100;
    scratchPercentage.current = percentage;

    if (percentage > 30) {
      onScratch();
    }
  };

  const rewardEmojis: { [key: string]: string } = {
    DISCOUNT: '🏷️',
    CASHBACK: '💰',
    POINTS: '⭐',
    COUPON: '🎟️',
    GIFT: '🎁',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-4 pb-0">
        <div className="text-center mb-4">
          <span className="text-4xl">{rewardEmojis[reward.reward_type] || '🎁'}</span>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 uppercase font-semibold">
            {reward.reward_type}
          </p>
        </div>
      </div>

      {/* Scratch Card Area */}
      <div className="relative h-40 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 overflow-hidden mx-4 my-3 rounded">
        {/* Hidden Content */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: isScratched ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {reward.reward_value}
            </div>
            {reward.reward_amount > 0 && (
              <div className="text-lg font-semibold text-green-600 dark:text-green-400 mt-1">
                ₹{reward.reward_amount}
              </div>
            )}
          </div>
        </div>

        {/* Scratch Layer */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full h-full cursor-pointer transition-opacity ${
            isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Claim Button */}
      <div className="p-4 pt-2">
        {isScratched && !reward.is_claimed ? (
          <button
            onClick={() => onClaim()}
            className="w-full bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Claim Reward ✓
          </button>
        ) : reward.is_claimed ? (
          <div className="text-center text-sm text-green-600 dark:text-green-400 font-semibold py-2">
            ✓ Already Claimed
          </div>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-400 font-bold py-2 px-4 rounded cursor-not-allowed"
          >
            Scratch to Reveal
          </button>
        )}
      </div>
    </div>
  );
}
