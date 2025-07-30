
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useMonitoring } from '@/hooks/useMonitoring';
import { useProductivitySettings } from '@/hooks/useProductivitySettings';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNavigate } from 'react-router-dom';
import { modes } from '@/lib/tracker_api';

import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import BreakReminder from '@/components/BreakReminder';
import PasscodeModal from '@/components/PasscodeModal';
import { useBreakReminder } from '@/hooks/useBreakReminder';
import { useWidgetManager } from '@/hooks/useWidgetManager';
import { useModeManager } from '@/hooks/useModeManager';
import { navigationTabs } from '@/config/navigationConfig';

interface DashboardProps {
  onOpenSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenSettings }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('today');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { isMonitoring, currentApp, startMonitoring, stopMonitoring } = useMonitoring();
  const { goals, blockedSites, breakReminders, updateGoal, toggleSiteBlock, addBlockedSite, setBreakReminders } = useProductivitySettings();
  const navigate = useNavigate();

  // Custom hooks for complex logic
  const { showBreakReminder, handleTakeBreak, handleDismissBreak } = useBreakReminder(breakReminders, isMonitoring, setBreakReminders);
  const { customWidgets, addCustomWidget, removeCustomWidget } = useWidgetManager();
  const { isKidsMode, showPasscodeModal, handleModeSwitch, handlePasscodeSuccess, setShowPasscodeModal } = useModeManager();

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  };

  const handleTabClick = (tabId: string) => {
    if (isKidsMode && tabId !== 'kids') return;
    
    if (tabId === 'settings') {
      onOpenSettings();
      return;
    }
    
    setActiveTab(tabId);
    const selectedTab = navigationTabs.find(tab => tab.id === tabId);
    if (selectedTab?.subTabs && selectedTab.subTabs.length > 0) {
      setActiveSubTab(selectedTab.subTabs[0].id);
    }
  };

  // Auto-navigate to kids mode when enabling
  useEffect(() => {
    if (isKidsMode) {
      setActiveTab('kids');
      setActiveSubTab('kids-mode');
    }
  }, [isKidsMode]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'm', ctrl: true, action: handleToggleMonitoring, description: 'Toggle monitoring' },
    { key: 's', ctrl: true, action: onOpenSettings, description: 'Open settings' },
    { key: 't', ctrl: true, action: toggleTheme, description: 'Toggle theme' },
    { key: '1', ctrl: true, action: () => { setActiveTab('overview'); setActiveSubTab('today'); }, description: 'Go to Overview' },
    { key: '2', ctrl: true, action: () => { setActiveTab('focus'); setActiveSubTab('focus-mode'); }, description: 'Go to Focus Mode' },
    { key: 'k', ctrl: true, action: () => handleModeSwitch(), description: 'Toggle Kids Mode' }
  ]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {showBreakReminder && (
        <BreakReminder onDismiss={handleDismissBreak} onTakeBreak={handleTakeBreak} />
      )}

      <TopBar
        isKidsMode={isKidsMode}
        onModeSwitch={handleModeSwitch}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMonitoring={isMonitoring}
        currentApp={currentApp}
        onToggleMonitoring={handleToggleMonitoring}
        onNavigateToProfile={() => navigate('/profile')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          activeTab={activeTab}
          activeSubTab={activeSubTab}
          isKidsMode={isKidsMode}
          onTabClick={handleTabClick}
          onSubTabClick={setActiveSubTab}
          tabs={navigationTabs}
        />

        <MainContent
          activeSubTab={activeSubTab}
          goals={goals}
          onUpdateGoal={updateGoal}
          blockedSites={blockedSites}
          onToggleSite={toggleSiteBlock}
          onAddSite={addBlockedSite}
          customWidgets={customWidgets}
          onAddWidget={addCustomWidget}
          onRemoveWidget={removeCustomWidget}
        />
      </div>

      <PasscodeModal
        isOpen={showPasscodeModal}
        onClose={() => setShowPasscodeModal(false)}
        onSuccess={handlePasscodeSuccess}
      />
    </div>
  );
};

export default Dashboard;