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