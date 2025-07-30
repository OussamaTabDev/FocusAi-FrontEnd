
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Gift, Sparkles, Heart, Zap } from 'lucide-react';

const KidsRewards = () => {
  const totalPoints = 1250;
  const nextRewardAt = 1500;
  const progressToNext = ((totalPoints / nextRewardAt) * 100);

  const rewards = [
    { name: '30 mins extra screen time', cost: 500, unlocked: true, icon: '⏰', type: 'privilege' },
    { name: 'Choose tomorrow\'s dinner', cost: 750, unlocked: true, icon: '🍽️', type: 'privilege' },
    { name: 'Movie night pick', cost: 1000, unlocked: true, icon: '🎬', type: 'privilege' },
    { name: 'Stay up 30 mins late', cost: 1500, unlocked: false, icon: '🌙', type: 'privilege' },
    { name: 'Special outing', cost: 2000, unlocked: false, icon: '🎯', type: 'privilege' },
  ];

  const gameRewards = [
    { name: 'Math Adventure', cost: 300, unlocked: true, icon: '🧮', type: 'game' },
    { name: 'Word Quest', cost: 350, unlocked: true, icon: '📝', type: 'game' },
    { name: 'Science Explorer', cost: 400, unlocked: false, icon: '🔬', type: 'game' },
    { name: 'Art Creator', cost: 450, unlocked: false, icon: '🎨', type: 'game' },
    { name: 'Puzzle Master', cost: 500, unlocked: false, icon: '🧩', type: 'game' },
  ];

  const badges = [
    { name: 'Study Star', description: 'Studied for 5 days straight!', earned: true, icon: '⭐' },
    { name: 'Creative Genius', description: 'Spent 10 hours creating!', earned: true, icon: '🎨' },
    { name: 'Time Master', description: 'Used screen time wisely for 7 days!', earned: false, icon: '⏱️' },
    { name: 'Good Listener', description: 'Followed all rules for a week!', earned: false, icon: '👂' },
  ];

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-2 border-purple-300 dark:border-purple-700">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Reward Center! ✨
            </h2>
            <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
          </div>
          
          <div className="mb-6">
            <div className="text-5xl font-bold text-purple-600 mb-2">{totalPoints}</div>
            <div className="text-lg text-purple-700 dark:text-purple-300">Super Points!</div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to next reward</span>
              <span>{totalPoints} / {nextRewardAt}</span>
            </div>
            <Progress value={progressToNext} className="h-4 bg-white dark:bg-gray-800" />
          </div>
          
          <div className="text-sm text-purple-700 dark:text-purple-300">
            Only {nextRewardAt - totalPoints} points until your next reward! 🎁
          </div>
        </div>
      </Card>

      {/* Fun Games Store */}
      <Card className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 border-2 border-indigo-300 dark:border-indigo-700">
        <h3 className="text-2xl font-bold text-center mb-6 text-indigo-700 dark:text-indigo-300">
          🎮 Fun Games to Buy!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameRewards.map((game, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 text-center ${
              game.unlocked 
                ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700' 
                : 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800'
            }`}>
              <div className="text-3xl mb-2">{game.icon}</div>
              <div className="font-bold mb-1">{game.name}</div>
              <div className="text-sm text-muted-foreground mb-3">{game.cost} points</div>
              <Button 
                size="sm" 
                disabled={!game.unlocked || totalPoints < game.cost}
                className={game.unlocked ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                {game.unlocked ? 'Bought!' : totalPoints >= game.cost ? 'Buy Now!' : 'Need More Points'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Special Privileges */}
      <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 border-2 border-yellow-300 dark:border-yellow-700">
        <h3 className="text-2xl font-bold text-center mb-6 text-orange-700 dark:text-orange-300">
          🎁 Special Privileges!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              reward.unlocked 
                ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{reward.icon}</span>
                  <span className="font-medium">{reward.name}</span>
                </div>
                {reward.unlocked && <Star className="h-5 w-5 text-yellow-500" />}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{reward.cost} points</span>
                <Button 
                  size="sm" 
                  disabled={!reward.unlocked || totalPoints < reward.cost}
                  className={reward.unlocked ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {reward.unlocked ? 'Claim!' : 'Locked'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 border-2 border-blue-300 dark:border-blue-700">
        <h3 className="text-2xl font-bold text-center mb-6 text-blue-700 dark:text-blue-300">
          🏆 Your Amazing Badges!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 text-center ${
              badge.earned 
                ? 'bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
            }`}>
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="font-bold mb-1">{badge.name}</div>
              <div className="text-sm text-muted-foreground">{badge.description}</div>
              {badge.earned && (
                <div className="mt-2 inline-flex items-center space-x-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs">
                  <Trophy className="h-3 w-3" />
                  <span>Earned!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Daily Challenges */}
      <Card className="p-6 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 border-2 border-green-300 dark:border-green-700">
        <h3 className="text-2xl font-bold text-center mb-6 text-green-700 dark:text-green-300">
          🌟 Today's Challenges!
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              <span>Study for 1 hour</span>
            </div>
            <div className="text-green-600 font-bold">+100 points</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              <span>Be creative for 30 minutes</span>
            </div>
            <div className="text-green-600 font-bold">+75 points</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">○</div>
              <span>Take 3 screen breaks</span>
            </div>
            <div className="text-gray-600 font-bold">+50 points</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KidsRewards;
