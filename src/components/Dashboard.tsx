import React, { useState, useEffect } from 'react';
import { Settings, User, Moon, Sun, Shield, Zap, Menu, Play, Square, Target, Globe, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useMonitoring } from '@/hooks/useMonitoring';
import { useProductivitySettings } from '@/hooks/useProductivitySettings';
import { useNavigate } from 'react-router-dom';
import PasscodeModal from '@/components/PasscodeModal';
import TodaySummary from '@/components/TodaySummary';
import Timeline from '@/components/Timeline';
import Reports from '@/components/Reports';
import FocusMode from '@/components/FocusMode';
import KidsMode from '@/components/KidsMode';
import ProductivityGoals from '@/components/ProductivityGoals';
import WebsiteBlocker from '@/components/WebsiteBlocker';
import KidsRewards from '@/components/KidsRewards';
import BreakReminder from '@/components/BreakReminder';
import AppManagement from '@/components/AppManagement';
import ImageWidget from '@/components/ImageWidget';
import PomodoroWidget from '@/components/PomodoroWidget';
import QuickNotesWidget from '@/components/QuickNotesWidget';
import WeatherWidget from '@/components/WeatherWidget';
import ProductivityScoreWidget from '@/components/ProductivityScoreWidget';
import HabitTrackerWidget from '@/components/HabitTrackerWidget';
import WidgetCustomizer from '@/components/WidgetCustomizer';
import DistractionCounterWidget from '@/components/DistractionCounterWidget';
import QuoteWidget from '@/components/QuoteWidget';
import SystemStatsWidget from '@/components/SystemStatsWidget';
import BookmarksWidget from '@/components/BookmarksWidget';
import MoodTrackerWidget from '@/components/MoodTrackerWidget';
import CalendarIntegrationWidget from '@/components/CalendarIntegrationWidget';
import TaskManagementWidget from '@/components/TaskManagementWidget';
import FocusMusicWidget from '@/components/FocusMusicWidget';
import ScreenTimeGoalsWidget from '@/components/ScreenTimeGoalsWidget';
import EnergyLevelTrackerWidget from '@/components/EnergyLevelTrackerWidget';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

import { modes } from '@/lib/tracker_api'; // Assuming modes is an API for switching between standard and kids mode

interface DashboardProps {
  onOpenSettings: () => void;
}

interface Widget {
  id: string;
  type: string;
  title: string;
  component: React.ComponentType<any>;
  size: 'small' | 'medium' | 'large';
}

const Dashboard: React.FC<DashboardProps> = ({ onOpenSettings }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('today');
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  
  // Widget management state
  const [customWidgets, setCustomWidgets] = useState<Widget[]>([]);
  
  const { theme, toggleTheme } = useTheme();
  const { isMonitoring, currentApp, startMonitoring, stopMonitoring } = useMonitoring();
  const { goals, blockedSites, breakReminders, updateGoal, toggleSiteBlock, addBlockedSite, setBreakReminders } = useProductivitySettings();
  const navigate = useNavigate();

  // Available widgets for customization
  const availableWidgets: Widget[] = [
    { id: 'pomodoro', type: 'pomodoro', title: 'Pomodoro Timer', component: PomodoroWidget, size: 'medium' },
    { id: 'quick-notes', type: 'quick-notes', title: 'Quick Notes', component: QuickNotesWidget, size: 'medium' },
    { id: 'weather', type: 'weather', title: 'Weather', component: WeatherWidget, size: 'small' },
    { id: 'productivity-score', type: 'productivity-score', title: 'Productivity Score', component: ProductivityScoreWidget, size: 'small' },
    { id: 'habit-tracker', type: 'habit-tracker', title: 'Habit Tracker', component: HabitTrackerWidget, size: 'medium' },
    { id: 'image', type: 'image', title: 'Image Widget', component: ImageWidget, size: 'medium' },
    { id: 'distraction-counter', type: 'distraction-counter', title: 'Distraction Counter', component: DistractionCounterWidget, size: 'small' },
    { id: 'quote', type: 'quote', title: 'Daily Quote', component: QuoteWidget, size: 'medium' },
    { id: 'system-stats', type: 'system-stats', title: 'System Stats', component: SystemStatsWidget, size: 'medium' },
    { id: 'bookmarks', type: 'bookmarks', title: 'Quick Bookmarks', component: BookmarksWidget, size: 'medium' },
    { id: 'mood-tracker', type: 'mood-tracker', title: 'Mood Tracker', component: MoodTrackerWidget, size: 'small' },
    { id: 'calendar-integration', type: 'calendar-integration', title: 'Calendar Integration', component: CalendarIntegrationWidget, size: 'medium' },
    { id: 'task-management', type: 'task-management', title: 'Task Management', component: TaskManagementWidget, size: 'large' },
    { id: 'focus-music', type: 'focus-music', title: 'Focus Music', component: FocusMusicWidget, size: 'medium' },
    { id: 'screen-time-goals', type: 'screen-time-goals', title: 'Screen Time Goals', component: ScreenTimeGoalsWidget, size: 'large' },
    { id: 'energy-tracker', type: 'energy-tracker', title: 'Energy Level Tracker', component: EnergyLevelTrackerWidget, size: 'medium' }
  ];

  // Load custom widgets from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('custom-widgets');
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets);
      // Map the saved widgets to include the component
      const mappedWidgets = parsedWidgets.map((saved: any) => {
        const availableWidget = availableWidgets.find(w => w.type === saved.type);
        return availableWidget ? { ...saved, component: availableWidget.component } : null;
      }).filter(Boolean);
      setCustomWidgets(mappedWidgets);
    }
  }, []);

  // Save custom widgets to localStorage
  const saveCustomWidgets = (widgets: Widget[]) => {
    const widgetsToSave = widgets.map(({ component, ...rest }) => rest);
    localStorage.setItem('custom-widgets', JSON.stringify(widgetsToSave));
    setCustomWidgets(widgets);
  };

  const addCustomWidget = (widget: Widget) => {
    const newWidget = { ...widget, id: `${widget.type}-${Date.now()}` };
    const updatedWidgets = [...customWidgets, newWidget];
    saveCustomWidgets(updatedWidgets);
  };

  const removeCustomWidget = (id: string) => {
    const updatedWidgets = customWidgets.filter(w => w.id !== id);
    saveCustomWidgets(updatedWidgets);
  };

  // Break reminder logic
  useEffect(() => {
    if (breakReminders.enabled && isMonitoring) {
      const checkBreakTime = () => {
        const timeSinceLastBreak = Date.now() - breakReminders.lastBreak;
        const shouldShowBreak = timeSinceLastBreak >= breakReminders.interval * 60 * 1000;
        
        if (shouldShowBreak) {
          setShowBreakReminder(true);
        }
      };

      const interval = setInterval(checkBreakTime, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [breakReminders, isMonitoring]);

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: BarChart3,
      subTabs: [
        { id: 'today', label: "Today's Summary" },
        { id: 'timeline', label: 'Timeline' },
        { id: 'reports', label: 'Reports' },
        { id: 'widgets', label: 'Custom Widgets' }
      ]
    },
    { 
      id: 'focus', 
      label: 'Focus & Goals', 
      icon: Target,
      subTabs: [
        { id: 'focus-mode', label: 'Focus Mode' },
        { id: 'goals', label: 'Goals' }
      ]
    },
    { 
      id: 'monitoring', 
      label: 'Monitoring', 
      icon: Globe,
      subTabs: [
        { id: 'blocker', label: 'Website Blocker' },
        { id: 'apps', label: 'App Management' }
      ]
    },
    { 
      id: 'kids', 
      label: 'Kids Mode', 
      icon: Shield,
      subTabs: [
        { id: 'kids-mode', label: 'Kids Mode' },
        { id: 'rewards', label: 'Kids Rewards' }
      ]
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      subTabs: []
    }
  ];

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  };
  // --- from api
  
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

  const renderContent = () => {
    switch (activeSubTab) {
      case 'today':
        return <TodaySummary />;
      case 'timeline':
        return <Timeline />;
      case 'reports':
        return <Reports />;
      case 'widgets':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Custom Widgets</h2>
              <WidgetCustomizer
                availableWidgets={availableWidgets}
                activeWidgets={customWidgets}
                onAddWidget={addCustomWidget}
                onRemoveWidget={removeCustomWidget}
              />
            </div>
            
            {customWidgets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customWidgets.map((widget) => {
                  const WidgetComponent = widget.component;
                  return (
                    <div 
                      key={widget.id} 
                      className={`
                        ${widget.size === 'small' ? 'h-48' : widget.size === 'large' ? 'h-80' : 'h-64'}
                      `}
                    >
                      <WidgetComponent />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No custom widgets added yet.</p>
                <WidgetCustomizer
                  availableWidgets={availableWidgets}
                  activeWidgets={customWidgets}
                  onAddWidget={addCustomWidget}
                  onRemoveWidget={removeCustomWidget}
                />
              </div>
            )}
          </div>
        );
      case 'focus-mode':
        return <FocusMode />;
      case 'goals':
        return <ProductivityGoals goals={goals} onUpdateGoal={updateGoal} />;
      case 'blocker':
        return <WebsiteBlocker blockedSites={blockedSites} onToggleSite={toggleSiteBlock} onAddSite={addBlockedSite} />;
      case 'apps':
        return <AppManagement />;
      case 'kids-mode':
        return <KidsMode />;
      case 'rewards':
        return <KidsRewards />;
      default:
        return <TodaySummary />;
    }
  };

  const getCurrentTabSubTabs = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    return currentTab?.subTabs || [];
  };

  const handleTabClick = (tabId: string) => {
    // Prevent navigation away from kids mode sections when in kids mode
    if (isKidsMode && tabId !== 'kids') {
      return;
    }
    
    if (tabId === 'settings') {
      onOpenSettings();
      return;
    }
    
    setActiveTab(tabId);
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab?.subTabs && selectedTab.subTabs.length > 0) {
      setActiveSubTab(selectedTab.subTabs[0].id);
    }
  };

  const handleModeSwitch = async () => {
  if (isKidsMode) {
    // leaving kids → ask for passcode first
    setShowPasscodeModal(true);
  } else {
      // standard → kids (no passcode)
      await modes.kids();          //  ← call backend
      setIsKidsMode(true);
      setActiveTab('kids');
      setActiveSubTab('kids-mode');
    }
  };

  const handlePasscodeSuccess = async () => {
    await modes.standard();        //  ← call backend
    setIsKidsMode(false);
    setShowPasscodeModal(false);
    setActiveTab('overview');
    setActiveSubTab('today');
  };

  
  // Auto-navigate to kids mode when enabling kids mode
  useEffect(() => {
    if (isKidsMode) {
      setActiveTab('kids');
      setActiveSubTab('kids-mode');
    }
  }, [isKidsMode]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'm',
      ctrl: true,
      action: handleToggleMonitoring,
      description: 'Toggle monitoring'
    },
    {
      key: 's',
      ctrl: true,
      action: onOpenSettings,
      description: 'Open settings'
    },
    {
      key: 't',
      ctrl: true,
      action: toggleTheme,
      description: 'Toggle theme'
    },
    {
      key: '1',
      ctrl: true,
      action: () => {
        setActiveTab('overview');
        setActiveSubTab('today');
      },
      description: 'Go to Overview'
    },
    {
      key: '2',
      ctrl: true,
      action: () => {
        setActiveTab('focus');
        setActiveSubTab('focus-mode');
      },
      description: 'Go to Focus Mode'
    },
    {
      key: 'k',
      ctrl: true,
      action: () => setIsKidsMode(!isKidsMode),
      description: 'Toggle Kids Mode'
    }
  ]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Break Reminder */}
      {showBreakReminder && (
        <BreakReminder onDismiss={handleDismissBreak} onTakeBreak={handleTakeBreak} />
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-primary">FocusAi Tracker</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <Button
              variant={isKidsMode ? "default" : "outline"}
              size="sm"
              onClick={handleModeSwitch}
              className="text-xs"
            >
              {isKidsMode ? 'Kids' : 'Standard'}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Current App Display */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-accent rounded-lg">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium">
              {isMonitoring ? `Current: ${currentApp}` : 'Not Monitoring'}
            </span>
          </div>

          {/* Monitoring Controls */}
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            onClick={handleToggleMonitoring}
            className="flex items-center space-x-2"
          >
            {isMonitoring ? (
              <>
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start Monitoring</span>
              </>
            )}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
            <User className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
          {/* Main Navigation */}
          <div className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  disabled={isKidsMode && tab.id !== 'kids'}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id && tab.id !== 'settings'
                      ? 'bg-primary text-primary-foreground'
                      : isKidsMode && tab.id !== 'kids'
                      ? 'text-muted-foreground/50 cursor-not-allowed'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  title={sidebarCollapsed ? tab.label : ''}
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{tab.label}</span>}
                </button>
              ))}
            </nav>
          </div>

          {/* Sub Navigation */}
          {!sidebarCollapsed && getCurrentTabSubTabs().length > 0 && (
            <div className="flex-1 px-4 pb-4">
              <div className="pt-2 border-t border-border">
                <div className="space-y-1">
                  {getCurrentTabSubTabs().map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setActiveSubTab(subTab.id)}
                      disabled={isKidsMode && activeTab !== 'kids'}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded transition-colors ${
                        activeSubTab === subTab.id
                          ? 'bg-accent text-accent-foreground'
                          : isKidsMode && activeTab !== 'kids'
                          ? 'text-muted-foreground/50 cursor-not-allowed'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* Passcode Modal */}
      <PasscodeModal
        isOpen={showPasscodeModal}
        onClose={() => setShowPasscodeModal(false)}
        onSuccess={handlePasscodeSuccess}
      />
    </div>
  );
};

export default Dashboard;
