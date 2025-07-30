
import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import SettingsModal from '@/components/SettingsModal';
// Update the import path below if WelcomePage is located elsewhere
import WelcomePage from '@/components/WelcomePage';
import { ThemeProvider } from '@/contexts/ThemeContext';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has seen the welcome page before
    const hasSeenWelcome = localStorage.getItem('welcome-seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <ThemeProvider>
        <WelcomePage onComplete={handleWelcomeComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Dashboard onOpenSettings={() => setShowSettings(true)} />
        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
