
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Calendar } from 'lucide-react';

const Reports = () => {
  const [timeframe, setTimeframe] = useState('daily');

  const reportData = {
    daily: {
      totalTime: '9h 12m',
      productive: 67,
      neutral: 28,
      distracting: 5,
      focusSessions: 4,
      avgFocusTime: '1h 23m'
    },
    weekly: {
      totalTime: '42h 35m',
      productive: 72,
      neutral: 23,
      distracting: 5,
      focusSessions: 28,
      avgFocusTime: '1h 31m'
    },
    monthly: {
      totalTime: '186h 20m',
      productive: 69,
      neutral: 26,
      distracting: 5,
      focusSessions: 124,
      avgFocusTime: '1h 28m'
    }
  };

  const data = reportData[timeframe as keyof typeof reportData];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg border border-border">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Screen Time</div>
          <div className="text-2xl font-bold">{data.totalTime}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Focus Sessions</div>
          <div className="text-2xl font-bold">{data.focusSessions}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Avg Focus Time</div>
          <div className="text-2xl font-bold">{data.avgFocusTime}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Productivity Score</div>
          <div className="text-2xl font-bold text-green-600">{data.productive}%</div>
        </Card>
      </div>

      {/* Productivity Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Productivity Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Productive Time</span>
              <span className="text-sm text-green-600">{data.productive}%</span>
            </div>
            <Progress value={data.productive} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Neutral Time</span>
              <span className="text-sm text-yellow-600">{data.neutral}%</span>
            </div>
            <Progress value={data.neutral} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Distracting Time</span>
              <span className="text-sm text-red-600">{data.distracting}%</span>
            </div>
            <Progress value={data.distracting} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Weekly Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Trends</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-muted-foreground mb-2">{day}</div>
              <div className="h-20 bg-accent rounded flex items-end justify-center p-1">
                <div 
                  className="w-full bg-primary rounded"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              </div>
              <div className="text-xs mt-1">{Math.floor(Math.random() * 3 + 6)}h</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
