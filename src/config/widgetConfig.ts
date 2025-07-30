// Import all widget components
import PomodoroWidget from '@/components/PomodoroWidget';
import QuickNotesWidget from '@/components/QuickNotesWidget';
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


import { Widget } from '../types/widgetTypes';

export const availableWidgets: Widget[] = [
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