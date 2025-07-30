
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