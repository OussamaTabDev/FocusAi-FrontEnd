
import { useState, useEffect } from 'react';
// tracker apis
import { tracker } from '@/lib/tracker_api';


export function useMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  /* ---------- one-time init ---------- */
  useEffect(() => {
    tracker.status().then(d => setIsMonitoring(d.is_tracking));
  }, []);

  /* ---------- poll current app ---------- */
  useEffect(() => {
      if (!isMonitoring) return;

      const id = setInterval(() => {
        tracker.current().then(info => {
          const newApp = info?.app || null;
          if (newApp !== currentApp) {
            setCurrentApp(newApp);
          }
        });
      }, 1000); // every 1 second (adjust as needed)

      return () => clearInterval(id);
    }, [isMonitoring, currentApp]);

  const startMonitoring = async () => {
    setIsMonitoring(true);
    await tracker.start();
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    await tracker.stop();
    setCurrentApp("FocusAi Tracker");
  };

  return {
    isMonitoring,
    currentApp,
    startMonitoring,
    stopMonitoring,
  };
}