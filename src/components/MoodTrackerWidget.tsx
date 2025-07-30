import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Calendar } from 'lucide-react';

interface MoodEntry {
  date: string;
  mood: string;
  emoji: string;
}

const MoodTrackerWidget: React.FC = () => {
  const [currentMood, setCurrentMood] = useState<string>('');
  const [weeklyMoods, setWeeklyMoods] = useState<MoodEntry[]>([]);

  const moods = [
    { name: 'great', emoji: '😄', color: 'text-green-500' },
    { name: 'good', emoji: '😊', color: 'text-blue-500' },
    { name: 'okay', emoji: '😐', color: 'text-yellow-500' },
    { name: 'bad', emoji: '😞', color: 'text-orange-500' },
    { name: 'terrible', emoji: '😢', color: 'text-red-500' }
  ];

  useEffect(() => {
    const today = new Date().toDateString();
    const savedMoods = localStorage.getItem('mood-tracker');
    
    if (savedMoods) {
      const moods = JSON.parse(savedMoods);
      setWeeklyMoods(moods);
      
      const todayMood = moods.find((entry: MoodEntry) => entry.date === today);
      if (todayMood) {
        setCurrentMood(todayMood.mood);
      }
    }
  }, []);

  const setMood = (moodName: string, emoji: string) => {
    const today = new Date().toDateString();
    const newEntry: MoodEntry = {
      date: today,
      mood: moodName,
      emoji: emoji
    };

    const updatedMoods = weeklyMoods.filter(entry => entry.date !== today);
    updatedMoods.push(newEntry);
    
    // Keep only last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const filteredMoods = updatedMoods.filter(entry => new Date(entry.date) >= sevenDaysAgo);

    setWeeklyMoods(filteredMoods);
    setCurrentMood(moodName);
    localStorage.setItem('mood-tracker', JSON.stringify(filteredMoods));
  };

  const getWeeklyAverage = () => {
    if (weeklyMoods.length === 0) return 'No data';
    
    const moodValues = { terrible: 1, bad: 2, okay: 3, good: 4, great: 5 };
    const total = weeklyMoods.reduce((sum, entry) => sum + (moodValues[entry.mood as keyof typeof moodValues] || 3), 0);
    const average = total / weeklyMoods.length;
    
    if (average >= 4.5) return 'Excellent 😄';
    if (average >= 3.5) return 'Good 😊';
    if (average >= 2.5) return 'Okay 😐';
    if (average >= 1.5) return 'Tough 😞';
    return 'Difficult 😢';
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Smile className="h-5 w-5 text-pink-500" />
        <h3 className="font-semibold">Mood Tracker</h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">How are you feeling today?</div>
          <div className="flex justify-center space-x-1">
            {moods.map((mood) => (
              <Button
                key={mood.name}
                variant={currentMood === mood.name ? "default" : "ghost"}
                size="sm"
                onClick={() => setMood(mood.name, mood.emoji)}
                className="h-8 w-8 p-0"
              >
                <span className="text-lg">{mood.emoji}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">This Week</span>
          </div>
          <div className="text-sm font-medium">{getWeeklyAverage()}</div>
        </div>

        <div className="flex justify-center space-x-1">
          {weeklyMoods.slice(-7).map((entry, index) => (
            <div key={index} className="text-lg" title={entry.date}>
              {entry.emoji}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MoodTrackerWidget;
