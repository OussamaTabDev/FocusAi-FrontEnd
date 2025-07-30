# Dashboard Component Split

Here's how I'll split the Dashboard.tsx file into smaller, more manageable components:

## 1. Main Dashboard Component (Dashboard.tsx)
```typescript
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useMonitoring } from '@/hooks/useMonitoring';
import { useProductivitySettings } from '@/hooks/useProductivitySettings';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNavigate } from 'react-router-dom';
import { modes } from '@/lib/tracker_api';

import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import BreakReminder from '@/components/BreakReminder';
import PasscodeModal from '@/components/PasscodeModal';
import { useBreakReminder } from './hooks/useBreakReminder';
import { useWidgetManager } from './hooks/useWidgetManager';
import { useModeManager } from './hooks/useModeManager';
import { navigationTabs } from './config/navigationConfig';

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
```

## 2. TopBar Component (components/TopBar.tsx)
```typescript
import React from 'react';
import { Menu, Play, Square, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopBarProps {
  isKidsMode: boolean;
  onModeSwitch: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isMonitoring: boolean;
  currentApp: string;
  onToggleMonitoring: () => void;
  onNavigateToProfile: () => void;
  theme: string;
  onToggleTheme: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  isKidsMode,
  onModeSwitch,
  sidebarCollapsed,
  onToggleSidebar,
  isMonitoring,
  currentApp,
  onToggleMonitoring,
  onNavigateToProfile,
  theme,
  onToggleTheme,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
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
            onClick={onModeSwitch}
            className="text-xs"
          >
            {isKidsMode ? 'Kids' : 'Standard'}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 bg-accent rounded-lg">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            {isMonitoring ? `Current: ${currentApp}` : 'Not Monitoring'}
          </span>
        </div>

        <Button
          variant={isMonitoring ? "destructive" : "default"}
          size="sm"
          onClick={onToggleMonitoring}
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

        <Button variant="ghost" size="sm" onClick={onNavigateToProfile}>
          <User className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onToggleTheme}>
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
```

## 3. Sidebar Component (components/Sidebar.tsx)
```typescript
import React from 'react';
import { NavigationTab } from '../types/navigationTypes';

interface SidebarProps {
  collapsed: boolean;
  activeTab: string;
  activeSubTab: string;
  isKidsMode: boolean;
  onTabClick: (tabId: string) => void;
  onSubTabClick: (subTabId: string) => void;
  tabs: NavigationTab[];
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  activeTab,
  activeSubTab,
  isKidsMode,
  onTabClick,
  onSubTabClick,
  tabs,
}) => {
  const getCurrentTabSubTabs = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    return currentTab?.subTabs || [];
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
      <div className="p-4">
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              disabled={isKidsMode && tab.id !== 'kids'}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 rounded-lg text-left transition-colors ${
                activeTab === tab.id && tab.id !== 'settings'
                  ? 'bg-primary text-primary-foreground'
                  : isKidsMode && tab.id !== 'kids'
                  ? 'text-muted-foreground/50 cursor-not-allowed'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              title={collapsed ? tab.label : ''}
            >
              <tab.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {!collapsed && getCurrentTabSubTabs().length > 0 && (
        <div className="flex-1 px-4 pb-4">
          <div className="pt-2 border-t border-border">
            <div className="space-y-1">
              {getCurrentTabSubTabs().map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => onSubTabClick(subTab.id)}
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
  );
};

export default Sidebar;
```

## 4. MainContent Component (components/MainContent.tsx)
```typescript
import React from 'react';
import TodaySummary from '@/components/TodaySummary';
import Timeline from '@/components/Timeline';
import Reports from '@/components/Reports';
import FocusMode from '@/components/FocusMode';
import ProductivityGoals from '@/components/ProductivityGoals';
import WebsiteBlocker from '@/components/WebsiteBlocker';
import AppManagement from '@/components/AppManagement';
import KidsMode from '@/components/KidsMode';
import KidsRewards from '@/components/KidsRewards';
import CustomWidgetsView from './CustomWidgetsView';
import { Widget } from '../types/widgetTypes';

interface MainContentProps {
  activeSubTab: string;
  goals: any;
  onUpdateGoal: (goal: any) => void;
  blockedSites: any;
  onToggleSite: (site: string) => void;
  onAddSite: (site: string) => void;
  customWidgets: Widget[];
  onAddWidget: (widget: Widget) => void;
  onRemoveWidget: (id: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  activeSubTab,
  goals,
  onUpdateGoal,
  blockedSites,
  onToggleSite,
  onAddSite,
  customWidgets,
  onAddWidget,
  onRemoveWidget,
}) => {
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
          <CustomWidgetsView
            customWidgets={customWidgets}
            onAddWidget={onAddWidget}
            onRemoveWidget={onRemoveWidget}
          />
        );
      case 'focus-mode':
        return <FocusMode />;
      case 'goals':
        return <ProductivityGoals goals={goals} onUpdateGoal={onUpdateGoal} />;
      case 'blocker':
        return <WebsiteBlocker blockedSites={blockedSites} onToggleSite={onToggleSite} onAddSite={onAddSite} />;
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

  return (
    <div className="flex-1 p-6 overflow-auto">
      {renderContent()}
    </div>
  );
};

export default MainContent;
```

## 5. Custom Hooks

### useBreakReminder Hook (hooks/useBreakReminder.ts)
```typescript
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
```

### useWidgetManager Hook (hooks/useWidgetManager.ts)
```typescript
import { useState, useEffect } from 'react';
import { Widget } from '../types/widgetTypes';
import { availableWidgets } from '../config/widgetConfig';

export const useWidgetManager = () => {
  const [customWidgets, setCustomWidgets] = useState<Widget[]>([]);

  useEffect(() => {
    const savedWidgets = localStorage.getItem('custom-widgets');
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets);
      const mappedWidgets = parsedWidgets.map((saved: any) => {
        const availableWidget = availableWidgets.find(w => w.type === saved.type);
        return availableWidget ? { ...saved, component: availableWidget.component } : null;
      }).filter(Boolean);
      setCustomWidgets(mappedWidgets);
    }
  }, []);

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

  return {
    customWidgets,
    addCustomWidget,
    removeCustomWidget
  };
};
```

### useModeManager Hook (hooks/useModeManager.ts)
```typescript
import { useState } from 'react';
import { modes } from '@/lib/tracker_api';

export const useModeManager = () => {
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);

  const handleModeSwitch = async () => {
    if (isKidsMode) {
      setShowPasscodeModal(true);
    } else {
      await modes.kids();
      setIsKidsMode(true);
    }
  };

  const handlePasscodeSuccess = async () => {
    await modes.standard();
    setIsKidsMode(false);
    setShowPasscodeModal(false);
  };

  return {
    isKidsMode,
    showPasscodeModal,
    handleModeSwitch,
    handlePasscodeSuccess,
    setShowPasscodeModal
  };
};
```

## 6. Configuration Files

### Navigation Config (config/navigationConfig.ts)
```typescript
import { BarChart3, Target, Globe, Shield, Settings } from 'lucide-react';
import { NavigationTab } from '../types/navigationTypes';

export const navigationTabs: NavigationTab[] = [
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
```

### Widget Config (config/widgetConfig.ts)
```typescript
// Import all widget components
import PomodoroWidget from '@/components/PomodoroWidget';
import QuickNotesWidget from '@/components/QuickNotesWidget';
// ... other imports

import { Widget } from '../types/widgetTypes';

export const availableWidgets: Widget[] = [
  { id: 'pomodoro', type: 'pomodoro', title: 'Pomodoro Timer', component: PomodoroWidget, size: 'medium' },
  { id: 'quick-notes', type: 'quick-notes', title: 'Quick Notes', component: QuickNotesWidget, size: 'medium' },
  // ... rest of the widgets
];
```

## 7. Type Definitions

### Navigation Types (types/navigationTypes.ts)
```typescript
import { LucideIcon } from 'lucide-react';

export interface SubTab {
  id: string;
  label: string;
}

export interface NavigationTab {
  id: string;
  label: string;
  icon: LucideIcon;
  subTabs: SubTab[];
}
```

### Widget Types (types/widgetTypes.ts)
```typescript
import React from 'react';

export interface Widget {
  id: string;
  type: string;
  title: string;
  component: React.ComponentType<any>;
  size: 'small' | 'medium' | 'large';
}
```

## Benefits of This Split:

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Maintainability**: Easier to find and fix bugs in specific functionality
4. **Testability**: Smaller components are easier to unit test
5. **Performance**: Components can be lazy-loaded if needed
6. **Readability**: Much easier to understand and navigate the codebase
7. **Team Development**: Multiple developers can work on different components simultaneously

This structure makes the codebase much more manageable and follows React best practices for component composition and separation of concerns.