
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Monitor, Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface ScreenTimeGoal {
  category: string;
  limit: number; // in minutes
  current: number; // in minutes
  color: string;
}

const ScreenTimeGoalsWidget = () => {
  const [goals] = useState<ScreenTimeGoal[]>([
    { category: 'Productive Apps', limit: 480, current: 357, color: 'text-green-600' },
    { category: 'Social Media', limit: 60, current: 85, color: 'text-red-600' },
    { category: 'Entertainment', limit: 120, current: 45, color: 'text-blue-600' },
    { category: 'Total Screen Time', limit: 600, current: 487, color: 'text-purple-600' }
  ]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 80) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const isOverLimit = (current: number, limit: number) => current > limit;

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Monitor className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Screen Time Goals</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = Math.min((goal.current / goal.limit) * 100, 100);
          const isOver = isOverLimit(goal.current, goal.limit);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{goal.category}</span>
                  {isOver && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
                <span className={`text-sm font-medium ${isOver ? 'text-red-600' : goal.color}`}>
                  {formatTime(goal.current)} / {formatTime(goal.limit)}
                </span>
              </div>
              
              <div className="relative">
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(goal.current, goal.limit)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
                {isOver && (
                  <div 
                    className="absolute top-0 left-0 h-2 bg-red-500/30 rounded-full"
                    style={{ width: '100%' }}
                  />
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {isOver ? (
                  <span className="text-red-600">
                    Over limit by {formatTime(goal.current - goal.limit)}
                  </span>
                ) : (
                  <span>
                    {formatTime(goal.limit - goal.current)} remaining
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-accent/30 rounded-lg">
        <div className="flex items-center space-x-2 text-sm">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span>15% better than yesterday</span>
        </div>
      </div>
    </Card>
  );
};

export default ScreenTimeGoalsWidget;
