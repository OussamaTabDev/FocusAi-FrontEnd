
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
import CustomWidgetsView from '@/components/CustomWidgetsView';
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