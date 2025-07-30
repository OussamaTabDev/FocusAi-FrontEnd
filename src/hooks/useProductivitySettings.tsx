
import { useState, useEffect } from 'react';

export interface ProductivityGoal {
  id: string;
  type: 'daily' | 'weekly';
  target: number; // in minutes
  current: number;
  category: 'productive' | 'focus' | 'break' | 'reading' | 'exercise';
}

export interface BlockedSite {
  url: string;
  category: 'social' | 'entertainment' | 'news' | 'other';
  isActive: boolean;
}

export const useProductivitySettings = () => {
  const [goals, setGoals] = useState<ProductivityGoal[]>([
    { id: '1', type: 'daily', target: 480, current: 357, category: 'productive' },
    { id: '2', type: 'daily', target: 120, current: 85, category: 'focus' },
    { id: '3', type: 'weekly', target: 2400, current: 1650, category: 'productive' }
  ]);

  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([
    { url: 'youtube.com', category: 'entertainment', isActive: true },
    { url: 'facebook.com', category: 'social', isActive: true },
    { url: 'twitter.com', category: 'social', isActive: false },
    { url: 'reddit.com', category: 'social', isActive: true },
    { url: 'netflix.com', category: 'entertainment', isActive: false }
  ]);

  const [breakReminders, setBreakReminders] = useState({
    enabled: true,
    interval: 25, // minutes
    lastBreak: Date.now() - 20 * 60 * 1000 // 20 minutes ago
  });

  const updateGoal = (id: string, current: number) => {
    setGoals(goals.map(goal => goal.id === id ? { ...goal, current } : goal));
  };

  const toggleSiteBlock = (url: string) => {
    setBlockedSites(sites => 
      sites.map(site => 
        site.url === url ? { ...site, isActive: !site.isActive } : site
      )
    );
  };

  const addBlockedSite = (url: string, category: BlockedSite['category']) => {
    setBlockedSites([...blockedSites, { url, category, isActive: true }]);
  };

  return {
    goals,
    blockedSites,
    breakReminders,
    updateGoal,
    toggleSiteBlock,
    addBlockedSite,
    setBreakReminders
  };
};
