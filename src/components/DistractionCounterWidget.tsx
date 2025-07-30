
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus, RotateCcw } from 'lucide-react';

const DistractionCounterWidget: React.FC = () => {
  const [count, setCount] = useState(0);
  const [dailyRecord, setDailyRecord] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedCount = localStorage.getItem(`distractions-${today}`);
    const savedRecord = localStorage.getItem('daily-distraction-record');
    
    if (savedCount) {
      setCount(parseInt(savedCount));
    }
    if (savedRecord) {
      setDailyRecord(parseInt(savedRecord));
    }
  }, []);

  const addDistraction = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    const today = new Date().toDateString();
    localStorage.setItem(`distractions-${today}`, newCount.toString());
    
    if (newCount > dailyRecord) {
      setDailyRecord(newCount);
      localStorage.setItem('daily-distraction-record', newCount.toString());
    }
  };

  const resetCount = () => {
    setCount(0);
    const today = new Date().toDateString();
    localStorage.setItem(`distractions-${today}`, '0');
  };

  const getMotivationMessage = () => {
    if (count === 0) return "Perfect focus! 🎯";
    if (count <= 3) return "Good control! 👍";
    if (count <= 7) return "Stay strong! 💪";
    return "Reset and refocus! 🔄";
  };

  return (
    <Card className="p-4 h-full flex flex-col justify-center">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold">Distractions Today</h3>
      </div>
      
      <div className="text-center space-y-3">
        <div className="text-4xl font-bold text-orange-500">{count}</div>
        <div className="text-sm text-muted-foreground">{getMotivationMessage()}</div>
        
        <div className="flex justify-center space-x-2">
          <Button size="sm" onClick={addDistraction} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={resetCount} variant="ghost">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Record: {dailyRecord} distractions
        </div>
      </div>
    </Card>
  );
};

export default DistractionCounterWidget;
