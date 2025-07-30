
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Timer, Volume2 } from 'lucide-react';
import WidgetSettingsPanel, { WidgetSettingsOption } from '@/components/WidgetSettingsPanel';

const PomodoroWidget: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoStart, setAutoStart] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (soundEnabled) {
        // Play notification sound
        console.log('Timer finished!');
      }
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? workDuration * 60 : breakDuration * 60);
      if (autoStart) {
        setTimeout(() => setIsActive(true), 1000);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, workDuration, breakDuration, soundEnabled, autoStart]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(workDuration * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const customOptions: WidgetSettingsOption[] = [
    {
      type: 'input',
      key: 'work-duration',
      label: 'Work Duration (minutes)',
      value: workDuration.toString(),
      onChange: (value: string) => {
        const num = parseInt(value) || 25;
        setWorkDuration(num);
        if (!isBreak && !isActive) {
          setTimeLeft(num * 60);
        }
      },
      description: 'Focus session duration'
    },
    {
      type: 'input',
      key: 'break-duration',
      label: 'Break Duration (minutes)',
      value: breakDuration.toString(),
      onChange: (value: string) => {
        const num = parseInt(value) || 5;
        setBreakDuration(num);
        if (isBreak && !isActive) {
          setTimeLeft(num * 60);
        }
      },
      description: 'Break session duration'
    },
    {
      type: 'divider',
      key: 'divider-1'
    },
    {
      type: 'switch',
      key: 'sound-enabled',
      label: 'Sound Notifications',
      value: soundEnabled,
      onChange: setSoundEnabled,
      description: 'Play sound when timer finishes'
    },
    {
      type: 'switch',
      key: 'auto-start',
      label: 'Auto-start Next Session',
      value: autoStart,
      onChange: setAutoStart,
      description: 'Automatically start the next session'
    }
  ];

  return (
    <Card className="p-4 h-full flex flex-col justify-center relative">
      <WidgetSettingsPanel
        widgetTitle="Pomodoro Timer"
        customOptions={customOptions}
        onRefresh={resetTimer}
        onDelete={() => console.log('Delete widget')}
      />
      
      <div className="flex items-center space-x-2 mb-4">
        <Timer className="h-5 w-5 text-red-500" />
        <h3 className="font-semibold">Pomodoro Timer</h3>
        {soundEnabled && <Volume2 className="h-4 w-4 text-muted-foreground" />}
      </div>
      
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-primary">
          {formatTime(timeLeft)}
        </div>
        <div className="text-sm text-muted-foreground">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>
        
        <div className="flex justify-center space-x-2">
          <Button size="sm" onClick={toggleTimer}>
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={resetTimer}>
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PomodoroWidget;
