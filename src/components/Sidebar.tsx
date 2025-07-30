
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