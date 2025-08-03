import React, { useEffect, useState } from 'react';
import { Clock, Target, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { analytics } from '@/lib/tracker_api';
import {useMonitoring} from '@/hooks/useMonitoring'
const TodaySummary = () => {
  const [productiveApps, setProductiveApps] = useState<any[]>([]);
  const [timeDistribution, setTimeDistribution] = useState<any>({});
  const [topApps, setTopApps] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const { isMonitoring, currentApp, startMonitoring, stopMonitoring } = useMonitoring();
  const fetchData = async () => {
    try {
      // Fetch productivity summary
      const productivitySummary = await analytics.productivitySummary(24);
      setTimeDistribution({
        productive: productivitySummary.times.Productive,
        neutral: productivitySummary.times.Neutral,
        distracting: productivitySummary.times.Distracting,
      });

      // Fetch productive apps ranking
      const productiveAppsRanking = await analytics.productiveApps(24);
      setProductiveApps(productiveAppsRanking.map(app => ({
        name: app[0],
        time: formatTime(app[1]),
        category: 'productive',
        color: 'bg-green-500',
      })));

      // Fetch top windows
      const topWindows = await analytics.topWindows(5, 24);
      setTopApps(topWindows.map(window => ({
        name: window.app,
        time: formatTime(window.time_seconds),
        category: window.type,
        color: window.type === 'productive' ? 'bg-green-500' : window.type === 'neutral' ? 'bg-yellow-500' : 'bg-red-500',
      })));

      // Fetch daily summary
      const dailySummary = await analytics.dailySummary(1);
      setInsights([
        {
          message: `Great productivity today! You spent ${formatPercentage(productivitySummary.percentages.Productive)} of your time on productive tasks.`,
          color: 'bg-blue-50',
        },
        {
          message: `Consider taking a break - you've been coding for ${formatTime(productiveAppsRanking[0][1])} straight.`,
          color: 'bg-yellow-50',
        },
        {
          message: `Your focus sessions are 20% longer than last week. Keep it up!`,
          color: 'bg-green-50',
        },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up interval to fetch data every min for better performance
    const intervalId = setInterval(fetchData, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [isMonitoring]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor((seconds % 3600) % 60);
    let text = ``;
    let x = 0
    if (hours !== 0 ) {
      x+=1
      text += `${hours}h`;

    }
    if (minutes !== 0) {
      x+=1
      text += ` ${minutes}min`;

    }
    if (x<2) {
      x+=1
      text +=  ` ${sec}s`;

    }
    return text;
  };

  const formatPercentage = (percentage: number) => {
    return `${Math.round(percentage)}%`;
  };

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
          <div className="text-2xl font-bold text-green-600">{timeDistribution.productive ? formatTime(timeDistribution.productive) : '0h 0m'}</div>
          <div className="text-sm text-muted-foreground">{timeDistribution.productive ? formatPercentage(timeDistribution.productive / (timeDistribution.productive + timeDistribution.neutral + timeDistribution.distracting) * 100) : '0%'} of screen time</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="font-medium">Neutral</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{timeDistribution.neutral ? formatTime(timeDistribution.neutral) : '0h 0m'}</div>
          <div className="text-sm text-muted-foreground">{timeDistribution.neutral ? formatPercentage(timeDistribution.neutral / (timeDistribution.productive + timeDistribution.neutral + timeDistribution.distracting) * 100) : '0%'} of screen time</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium">Distracting</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{timeDistribution.distracting ? formatTime(timeDistribution.distracting) : '0h 0m'}</div>
          <div className="text-sm text-muted-foreground">{timeDistribution.distracting ? formatPercentage(timeDistribution.distracting / (timeDistribution.productive + timeDistribution.neutral + timeDistribution.distracting) * 100) : '0%'} of screen time</div>
        </Card>
      </div>

      {/* Top Apps */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top 5 Applications</h3>
        <div className="space-y-4">
          {topApps.map((app, index) => (
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
          {insights.map((insight, index) => (
            <div key={index} className={`p-3 ${insight.color} dark:bg-blue-950 rounded-lg`}>
              <p className="text-sm">{insight.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TodaySummary;