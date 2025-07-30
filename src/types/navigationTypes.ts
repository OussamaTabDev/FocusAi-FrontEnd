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