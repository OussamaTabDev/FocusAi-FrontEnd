
import { useState, useEffect } from 'react';

export const useBreakReminder = (breakReminders: any, isMonitoring: boolean, setBreakReminders: any) => {
  const [showBreakReminder, setShowBreakReminder] = useState(false);

  useEffect(() => {
    if (breakReminders.enabled && isMonitoring) {
      const checkBreakTime = () => {
        const timeSinceLastBreak = Date.now() - breakReminders.lastBreak;
        const shouldShowBreak = timeSinceLastBreak >= breakReminders.interval * 60 * 1000;
        
        if (shouldShowBreak) {
          setShowBreakReminder(true);
        }
      };

      const interval = setInterval(checkBreakTime, 60000);
      return () => clearInterval(interval);
    }
  }, [breakReminders, isMonitoring]);

  const handleTakeBreak = () => {
    setShowBreakReminder(false);
    setBreakReminders({
      ...breakReminders,
      lastBreak: Date.now()
    });
  };

  const handleDismissBreak = () => {
    setShowBreakReminder(false);
    setBreakReminders({
      ...breakReminders,
      lastBreak: Date.now() - (breakReminders.interval * 60 * 1000) + (5 * 60 * 1000)
    });
  };

  return {
    showBreakReminder,
    handleTakeBreak,
    handleDismissBreak
  };
};
