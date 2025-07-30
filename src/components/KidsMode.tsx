
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Clock, Lock, Power, Star, Heart, Smile, Sun, X } from 'lucide-react';

const KidsMode = () => {
  const [modalDismissed, setModalDismissed] = useState(false);
  const timeRemaining = 1.2; // hours - set to 0 to show limit reached
  const dailyLimit = 4; // hours
  const usagePercent = ((dailyLimit - timeRemaining) / dailyLimit) * 100;
  const currentHour = new Date().getHours();
  const isOutsideAllowedHours = currentHour < 9 || currentHour >= 20; // 9 AM to 8 PM
  const isLimitReached = (timeRemaining <= 0 || isOutsideAllowedHours) && !modalDismissed;

  const blockedApps = [
    'YouTube', 'TikTok', 'Instagram', 'Snapchat', 'Discord', 
    'Twitch', 'Reddit', 'Twitter', 'Facebook', 'Games'
  ];

  const allowedHours = '9:00 AM - 8:00 PM';

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-lg">
      {/* Limit Reached Modal */}
      {isLimitReached && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md mx-4 p-8 text-center relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setModalDismissed(true);
                // This will trigger backend to enforce limit and lock computer
                console.log('Enforcing screen time limit - computer will be locked');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
              {timeRemaining <= 0 ? "Time's Up!" : "Computer Time Over!"}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {timeRemaining <= 0 
                ? "You've used all your screen time for today! Great job staying focused." 
                : "It's outside your allowed computer hours. Time for other fun activities!"}
            </p>
            <div className="space-y-4">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  💡 You can earn more time by completing your chores and homework!
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-lg py-3"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Ask Parents for More Time
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-green-400 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 text-lg py-3"
                >
                  <Power className="h-5 w-5 mr-2" />
                  Go Play Outside! 🌳
                </Button>
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              {timeRemaining <= 0 
                ? "Tomorrow you'll get fresh time to use!" 
                : `Come back during ${allowedHours} for computer time!`}
            </div>
          </div>
        </div>
      )}
      {/* Fun Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Star className="h-8 w-8 text-yellow-500 animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Kids Corner! 🌈
          </h2>
          <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Have fun while staying safe online!</p>
      </div>

      {/* Screen Time - Fun Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 border-2 border-green-300 dark:border-green-700">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Screen Time Left</h3>
              <Smile className="h-6 w-6 text-green-600" />
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-green-600 mb-4">
                {timeRemaining}h
              </div>
              <div className="text-lg text-green-700 dark:text-green-300 mb-6">
                Out of {dailyLimit}h today
              </div>
              <div className="relative">
                <Progress value={usagePercent} className="h-6 bg-white dark:bg-gray-800" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {((dailyLimit - timeRemaining)).toFixed(1)}h used
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 border-2 border-yellow-300 dark:border-yellow-700">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sun className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300">Computer Time</h3>
              <Sun className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-4xl font-bold text-orange-600 mb-4">
              {allowedHours}
            </div>
            <div className="text-lg text-orange-700 dark:text-orange-300 mb-4">
              Your allowed hours
            </div>
            <div className="inline-flex items-center space-x-2 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">You can use the computer now!</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fun Activities Section */}
      <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-2 border-purple-300 dark:border-purple-700">
        <h3 className="text-2xl font-bold text-center mb-6 text-purple-700 dark:text-purple-300">
          🎯 Today's Computer Adventures!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-lg font-bold text-blue-600">Learning Time</div>
            <div className="text-2xl font-bold text-blue-700">1h 23m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Great job studying!</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-lg font-bold text-green-600">Creative Time</div>
            <div className="text-2xl font-bold text-green-700">45m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Amazing creativity!</div>
          </div>
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
            <div className="text-lg font-bold text-purple-600">Family Time</div>
            <div className="text-2xl font-bold text-purple-700">22m</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Keep in touch!</div>
          </div>
        </div>
      </Card>

      {/* Blocked Apps - Child Friendly */}
      <Card className="p-6 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 border-2 border-red-300 dark:border-red-700">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">🚫 Not Available Right Now</h3>
          <p className="text-red-600 dark:text-red-400">These apps are taking a break so you can focus!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {blockedApps.map((app, index) => (
            <div key={index} className="flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-red-200 dark:border-red-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{app}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
              Remember: Your parents will know if you try to visit blocked sites!
            </p>
          </div>
        </div>
      </Card>

      {/* Big Friendly Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          size="lg" 
          className="h-16 text-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
        >
          <Clock className="h-6 w-6 mr-2" />
          Ask for More Time
        </Button>
        <Button 
          size="lg" 
          variant="outline"
          className="h-16 text-xl border-2 border-green-400 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 shadow-lg"
        >
          <Shield className="h-6 w-6 mr-2" />
          Call Mom or Dad
        </Button>
      </div>

      {/* Games Store */}
      <Card className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 border-2 border-indigo-300 dark:border-indigo-700">
        <h3 className="text-2xl font-bold text-center mb-6 text-indigo-700 dark:text-indigo-300">
          🎮 Fun Games Store!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { name: 'Math Adventure', icon: '🧮', price: 300, owned: true, description: 'Learn math while having fun!' },
            { name: 'Word Quest', icon: '📝', price: 350, owned: true, description: 'Build your vocabulary!' },
            { name: 'Science Explorer', icon: '🔬', price: 400, owned: false, description: 'Discover amazing science facts!' },
            { name: 'Art Creator', icon: '🎨', price: 450, owned: false, description: 'Draw and create beautiful art!' },
            { name: 'Puzzle Master', icon: '🧩', price: 500, owned: false, description: 'Challenge your brain!' },
          ].map((game, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 text-center ${
              game.owned 
                ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700' 
                : 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800'
            }`}>
              <div className="text-4xl mb-2">{game.icon}</div>
              <div className="font-bold text-lg mb-1">{game.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">{game.description}</div>
              {game.owned ? (
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                  Play Now! 🎯
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {game.price} points
                  </div>
                  <Button size="sm" variant="outline" className="border-indigo-400 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                    Buy Game
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
          <p className="text-indigo-700 dark:text-indigo-300 font-medium">
            💡 Earn points by completing challenges to unlock more games!
          </p>
        </div>
      </Card>

      {/* Safety Reminder */}
      <Card className="p-6 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 border-2 border-green-300 dark:border-green-700">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-green-600" />
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">You're Safe Online! 🛡️</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Safe search is on</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Bad websites blocked</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Parents are watching</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Time limits active</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Downloads protected</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Friends list safe</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KidsMode;
