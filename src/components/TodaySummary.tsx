
import React from 'react';
import { Clock, Target, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const TodaySummary = () => {
  const productiveApps = [
    { name: 'Visual Studio Code', time: '3h 45m', category: 'productive', color: 'bg-green-500' },
    { name: 'Figma', time: '2h 12m', category: 'productive', color: 'bg-green-500' },
    { name: 'Slack', time: '1h 33m', category: 'neutral', color: 'bg-yellow-500' },
    { name: 'Chrome', time: '1h 22m', category: 'neutral', color: 'bg-yellow-500' },
    { name: 'YouTube', time: '45m', category: 'distracting', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Today's Summary</h2>
        <div className="text-sm text-muted-foreground">Tuesday, June 24, 2025</div>
      </div>

      {/* Time Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">Productive</span>
          </div>
          <div className="text-2xl font-bold text-green-600">5h 57m</div>
          <div className="text-sm text-muted-foreground">65% of screen time</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium">Neutral</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">2h 55m</div>
          <div className="text-sm text-muted-foreground">32% of screen time</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium">Distracting</span>
          </div>
          <div className="text-2xl font-bold text-red-600">45m</div>
          <div className="text-sm text-muted-foreground">3% of screen time</div>
        </Card>
      </div>

      {/* Top Apps */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top 5 Applications</h3>
        <div className="space-y-4">
          {productiveApps.map((app, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-8 ${app.color} rounded`}></div>
                <span className="font-medium">{app.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{app.time}</div>
                <div className="text-xs text-muted-foreground capitalize">{app.category}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">AI Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm">🎯 Great productivity today! You spent 65% of your time on productive tasks.</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <p className="text-sm">⚡ Consider taking a break - you've been coding for 3+ hours straight.</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <p className="text-sm">📈 Your focus sessions are 20% longer than last week. Keep it up!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TodaySummary;
