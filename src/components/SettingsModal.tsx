import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppCategoriesSettings from '@/components/AppCategoriesSettings';
import NotificationSettingsComponent from '@/components/NotificationSettings';
import AdvancedSettingsComponent from '@/components/AdvancedSettingsComponent';
import KidsModeSettings from '@/components/KidsModeSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('general');

  if (!isOpen) return null;

  const sections = [
    { id: 'general', label: 'General' },
    { id: 'categories', label: 'App Categories' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'ai', label: 'AI & Insights' },
    { id: 'focus', label: 'Focus Mode' },
    { id: 'kids', label: 'Kids Mode' },
    { id: 'privacy', label: 'Privacy' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'categories':
        return <AppCategoriesSettings />;
      
      case 'notifications':
        return <NotificationSettingsComponent />;
      
      case 'advanced':
        return <AdvancedSettingsComponent />;

      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Theme</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="light" name="theme" className="h-4 w-4" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="dark" name="theme" className="h-4 w-4" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="auto" name="theme" className="h-4 w-4" defaultChecked />
                  <Label htmlFor="auto">System</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Start with Windows</Label>
                <p className="text-sm text-muted-foreground">Launch FocusAi Tracker when Windows starts</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Minimize to System Tray</Label>
                <p className="text-sm text-muted-foreground">Keep running in background when closed</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Show alerts and reminders</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">AI Insights</Label>
                <p className="text-sm text-muted-foreground">Get personalized productivity insights</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <Label htmlFor="insights-frequency" className="text-base font-medium">Insights Frequency</Label>
              <select className="mt-1 w-full p-2 border border-border rounded-md bg-background">
                <option>Real-time</option>
                <option>Hourly</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>

            <div>
              <Label htmlFor="productivity-goal" className="text-base font-medium">Daily Productivity Goal</Label>
              <div className="mt-1 flex items-center space-x-2">
                <Input id="productivity-goal" type="number" defaultValue="70" className="w-20" />
                <span className="text-sm text-muted-foreground">% productive time</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Smart Reminders</Label>
                <p className="text-sm text-muted-foreground">AI suggests break times and focus sessions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        );

      case 'focus':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="focus-duration" className="text-base font-medium">Default Focus Session</Label>
              <select className="mt-1 w-full p-2 border border-border rounded-md bg-background">
                <option>25 minutes (Pomodoro)</option>
                <option>45 minutes</option>
                <option>90 minutes (Deep Work)</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <Label className="text-base font-medium">Blocked Applications</Label>
              <div className="mt-2 space-y-2">
                <Input placeholder="Add application name..." />
                <div className="flex flex-wrap gap-2">
                  {['YouTube', 'Facebook', 'Twitter', 'Instagram'].map((app) => (
                    <span key={app} className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-sm">
                      {app} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Blocked Websites</Label>
              <div className="mt-2 space-y-2">
                <Input placeholder="Add website URL..." />
                <div className="flex flex-wrap gap-2">
                  {['youtube.com', 'facebook.com', 'twitter.com'].map((site) => (
                    <span key={site} className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-sm">
                      {site} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Strict Mode</Label>
                <p className="text-sm text-muted-foreground">Prevent bypassing blocks during focus sessions</p>
              </div>
              <Switch />
            </div>
          </div>
        );

      case 'kids':
        return <KidsModeSettings />;

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Data Retention</Label>
              <select className="mt-1 w-full p-2 border border-border rounded-md bg-background">
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Screenshot Capture</Label>
                <p className="text-sm text-muted-foreground">Take periodic screenshots for timeline</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Keystroke Logging</Label>
                <p className="text-sm text-muted-foreground">Log keystrokes for productivity analysis</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Cloud Sync</Label>
                <p className="text-sm text-muted-foreground">Sync data across devices</p>
              </div>
              <Switch />
            </div>

            <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ All data is stored locally on your device. We never send your activity data to external servers without your explicit consent.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-6xl h-[85vh] flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h3 className="text-xl font-semibold capitalize">{activeSection === 'categories' ? 'App Categories' : activeSection} Settings</h3>
          </div>
          {renderSection()}
          
          <div className="flex justify-end space-x-2 mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
