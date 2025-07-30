
import { useState, useEffect } from 'react';

export interface AppCategory {
  id: string;
  name: string;
  color: string;
  type: 'productive' | 'neutral' | 'distracting';
  keywords: string[];
}

export interface AppRule {
  id: string;
  appName: string;
  categoryId: string;
  isCustom: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  types: {
    breakReminders: boolean;
    focusComplete: boolean;
    goalAchieved: boolean;
    weeklyReport: boolean;
    appBlocked: boolean;
  };
  sound: boolean;
  desktop: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'instant' | 'batched' | 'summary';
}

export interface AdvancedSettings {
  monitoring: {
    idleThreshold: number; // minutes
    screenshotInterval: number; // minutes, 0 = disabled
    trackKeystrokes: boolean;
    accurateTimeTracking: boolean;
  };
  privacy: {
    dataRetention: number; // days
    anonymizeData: boolean;
    shareAnalytics: boolean;
  };
  performance: {
    autoStart: boolean;
    minimizeToTray: boolean;
    lowPowerMode: boolean;
  };
}

export const useAdvancedSettings = () => {
  const [categories, setCategories] = useState<AppCategory[]>([
    { id: '1', name: 'Development', color: '#10b981', type: 'productive', keywords: ['code', 'vscode', 'terminal', 'git'] },
    { id: '2', name: 'Design', color: '#8b5cf6', type: 'productive', keywords: ['figma', 'photoshop', 'sketch'] },
    { id: '3', name: 'Communication', color: '#f59e0b', type: 'neutral', keywords: ['slack', 'teams', 'zoom', 'email'] },
    { id: '4', name: 'Social Media', color: '#ef4444', type: 'distracting', keywords: ['facebook', 'twitter', 'instagram', 'tiktok'] },
    { id: '5', name: 'Entertainment', color: '#ec4899', type: 'distracting', keywords: ['youtube', 'netflix', 'games', 'streaming'] },
  ]);

  const [appRules, setAppRules] = useState<AppRule[]>([
    { id: '1', appName: 'Visual Studio Code', categoryId: '1', isCustom: false },
    { id: '2', appName: 'Figma', categoryId: '2', isCustom: false },
    { id: '3', appName: 'Slack', categoryId: '3', isCustom: false },
    { id: '4', appName: 'YouTube', categoryId: '5', isCustom: false },
  ]);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    enabled: true,
    types: {
      breakReminders: true,
      focusComplete: true,
      goalAchieved: true,
      weeklyReport: false,
      appBlocked: true,
    },
    sound: true,
    desktop: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    frequency: 'instant',
  });

  const [advanced, setAdvanced] = useState<AdvancedSettings>({
    monitoring: {
      idleThreshold: 5,
      screenshotInterval: 0,
      trackKeystrokes: false,
      accurateTimeTracking: true,
    },
    privacy: {
      dataRetention: 90,
      anonymizeData: false,
      shareAnalytics: false,
    },
    performance: {
      autoStart: false,
      minimizeToTray: true,
      lowPowerMode: false,
    },
  });

  const addCategory = (category: Omit<AppCategory, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<AppCategory>) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    setAppRules(appRules.filter(rule => rule.categoryId !== id));
  };

  const addAppRule = (appName: string, categoryId: string) => {
    const newRule: AppRule = {
      id: Date.now().toString(),
      appName,
      categoryId,
      isCustom: true,
    };
    setAppRules([...appRules, newRule]);
  };

  const updateAppRule = (id: string, updates: Partial<AppRule>) => {
    setAppRules(appRules.map(rule => rule.id === id ? { ...rule, ...updates } : rule));
  };

  const deleteAppRule = (id: string) => {
    setAppRules(appRules.filter(rule => rule.id !== id));
  };

  const getCategoryForApp = (appName: string): AppCategory | null => {
    const rule = appRules.find(rule => rule.appName.toLowerCase() === appName.toLowerCase());
    if (rule) {
      return categories.find(cat => cat.id === rule.categoryId) || null;
    }

    // Auto-categorize based on keywords
    for (const category of categories) {
      if (category.keywords.some(keyword => appName.toLowerCase().includes(keyword.toLowerCase()))) {
        return category;
      }
    }

    return null;
  };

  return {
    categories,
    appRules,
    notifications,
    advanced,
    addCategory,
    updateCategory,
    deleteCategory,
    addAppRule,
    updateAppRule,
    deleteAppRule,
    getCategoryForApp,
    setNotifications,
    setAdvanced,
  };
};
