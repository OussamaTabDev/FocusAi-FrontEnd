
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Target } from 'lucide-react';

const ProductivityScoreWidget: React.FC = () => {
  const [score, setScore] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    // Simulate productivity score calculation
    const calculateScore = () => {
      const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const previousScore = parseInt(localStorage.getItem('previous-productivity-score') || '75');
      
      localStorage.setItem('previous-productivity-score', baseScore.toString());
      
      if (baseScore > previousScore + 5) setTrend('up');
      else if (baseScore < previousScore - 5) setTrend('down');
      else setTrend('stable');
      
      setScore(baseScore);
    };

    calculateScore();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <Target className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className="p-4 h-full flex flex-col justify-center">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Target className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Productivity Score</h3>
        </div>
        
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
        
        <div className="flex items-center justify-center space-x-1">
          {getTrendIcon()}
          <span className="text-sm text-muted-foreground">
            {trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'Stable'}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProductivityScoreWidget;
