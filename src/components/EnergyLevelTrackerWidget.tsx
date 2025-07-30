
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Battery, Plus, TrendingUp, Clock } from 'lucide-react';

interface EnergyEntry {
  time: string;
  level: number; // 1-5 scale
  note?: string;
}

const EnergyLevelTrackerWidget = () => {
  const [entries, setEntries] = useState<EnergyEntry[]>([
    { time: '09:00', level: 4, note: 'Good morning energy' },
    { time: '11:30', level: 3, note: 'Post-meeting dip' },
    { time: '14:00', level: 2, note: 'After lunch low' },
    { time: '16:00', level: 4, note: 'Afternoon boost' }
  ]);
  const [currentLevel, setCurrentLevel] = useState(3);

  const addEntry = () => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    setEntries([...entries, {
      time: timeString,
      level: currentLevel,
      note: ''
    }]);
  };

  const getEnergyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-amber-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getEnergyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Unknown';
    }
  };

  const averageEnergy = entries.length > 0 
    ? Math.round(entries.reduce((sum, entry) => sum + entry.level, 0) / entries.length * 10) / 10
    : 0;

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Battery className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Energy Level</h3>
      </div>

      {/* Current Level Selector */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">How's your energy right now?</p>
        <div className="flex space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setCurrentLevel(level)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                currentLevel === level 
                  ? `${getEnergyColor(level)} border-white` 
                  : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
              }`}
              title={getEnergyLabel(level)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{getEnergyLabel(currentLevel)}</span>
          <Button onClick={addEntry} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Log
          </Button>
        </div>
      </div>

      {/* Today's Entries */}
      <div className="space-y-2 max-h-32 overflow-y-auto mb-4">
        {entries.slice(-4).map((entry, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-accent/30 rounded">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{entry.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getEnergyColor(entry.level)}`} />
              <span className="text-xs">{getEnergyLabel(entry.level)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Average */}
      <div className="p-3 bg-accent/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Today's Average</span>
          </div>
          <span className="text-lg font-bold">{averageEnergy}/5</span>
        </div>
      </div>
    </Card>
  );
};

export default EnergyLevelTrackerWidget;
