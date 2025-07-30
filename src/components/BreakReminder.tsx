
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Coffee, X, Eye } from 'lucide-react';

interface BreakReminderProps {
  onDismiss: () => void;
  onTakeBreak: () => void;
}

const BreakReminder: React.FC<BreakReminderProps> = ({ onDismiss, onTakeBreak }) => {
  const [showExercises, setShowExercises] = useState(false);

  const eyeExercises = [
    "Look away from screen for 20 seconds",
    "Focus on something 20 feet away",
    "Blink 20 times slowly",
    "Close eyes and rest for 30 seconds"
  ];

  const physicalExercises = [
    "Stand up and stretch your arms",
    "Roll your shoulders backwards 10 times",
    "Take 5 deep breaths",
    "Walk around for 2 minutes"
  ];

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Coffee className="h-5 w-5" />
            <h3 className="font-bold">Time for a Break!</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm mb-4 opacity-90">
          You've been working for 25+ minutes. Take a short break to stay productive!
        </p>

        <div className="space-y-2">
          <Button 
            onClick={onTakeBreak}
            className="w-full bg-white text-blue-600 hover:bg-gray-100"
          >
            <Clock className="h-4 w-4 mr-2" />
            Start 5-minute Break
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => setShowExercises(!showExercises)}
            className="w-full text-white hover:bg-white/20"
          >
            <Eye className="h-4 w-4 mr-2" />
            Quick Exercises
          </Button>
        </div>

        {showExercises && (
          <div className="mt-4 space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">👁️ Eye Exercises</h4>
              <ul className="text-xs space-y-1 opacity-90">
                {eyeExercises.map((exercise, index) => (
                  <li key={index}>• {exercise}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">🤸 Physical Exercises</h4>
              <ul className="text-xs space-y-1 opacity-90">
                {physicalExercises.map((exercise, index) => (
                  <li key={index}>• {exercise}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BreakReminder;
