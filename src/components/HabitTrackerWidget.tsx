
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Calendar } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

const HabitTrackerWidget: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: '8 glasses of water', completed: false },
    { id: '2', name: '30 min exercise', completed: false },
    { id: '3', name: '10 min meditation', completed: false },
    { id: '4', name: 'Read for 20 min', completed: false }
  ]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedHabits = localStorage.getItem(`habits-${today}`);
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    
    const today = new Date().toDateString();
    localStorage.setItem(`habits-${today}`, JSON.stringify(updatedHabits));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = Math.round((completedCount / habits.length) * 100);

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold">Daily Habits</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {completedCount}/{habits.length}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleHabit(habit.id)}
              className="p-0 h-auto"
            >
              {habit.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <span className={`text-sm flex-1 ${habit.completed ? 'line-through text-muted-foreground' : ''}`}>
              {habit.name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{completionRate}%</div>
        <div className="text-xs text-muted-foreground">Complete</div>
      </div>
    </Card>
  );
};

export default HabitTrackerWidget;
