
import React from 'react';
import { Bell, Volume2, VolumeX, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationSettings, useAdvancedSettings } from '@/hooks/useAdvancedSettings';

const NotificationSettingsComponent: React.FC = () => {
  const { notifications, setNotifications } = useAdvancedSettings();

  const updateNotifications = (updates: Partial<NotificationSettings>) => {
    setNotifications({ ...notifications, ...updates });
  };

  const updateNotificationTypes = (type: keyof NotificationSettings['types'], value: boolean) => {
    updateNotifications({
      types: { ...notifications.types, [type]: value }
    });
  };

  const updateQuietHours = (updates: Partial<NotificationSettings['quietHours']>) => {
    updateNotifications({
      quietHours: { ...notifications.quietHours, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Notification Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Turn on/off all notifications</p>
            </div>
            <Switch
              checked={notifications.enabled}
              onCheckedChange={(value) => updateNotifications({ enabled: value })}
            />
          </div>

          {notifications.enabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Sound Notifications</Label>
                  <p className="text-sm text-muted-foreground">Play sound with notifications</p>
                </div>
                <div className="flex items-center space-x-2">
                  {notifications.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <Switch
                    checked={notifications.sound}
                    onCheckedChange={(value) => updateNotifications({ sound: value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications on desktop</p>
                </div>
                <Switch
                  checked={notifications.desktop}
                  onCheckedChange={(value) => updateNotifications({ desktop: value })}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Notification Frequency</Label>
                <Select
                  value={notifications.frequency}
                  onValueChange={(value: 'instant' | 'batched' | 'summary') => updateNotifications({ frequency: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="batched">Batched (every 30 minutes)</SelectItem>
                    <SelectItem value="summary">Daily Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      {notifications.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Choose which types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Break Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders to take breaks during work</p>
              </div>
              <Switch
                checked={notifications.types.breakReminders}
                onCheckedChange={(value) => updateNotificationTypes('breakReminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Focus Session Complete</Label>
                <p className="text-sm text-muted-foreground">When focus sessions end</p>
              </div>
              <Switch
                checked={notifications.types.focusComplete}
                onCheckedChange={(value) => updateNotificationTypes('focusComplete', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Goal Achieved</Label>
                <p className="text-sm text-muted-foreground">When productivity goals are met</p>
              </div>
              <Switch
                checked={notifications.types.goalAchieved}
                onCheckedChange={(value) => updateNotificationTypes('goalAchieved', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Weekly productivity summaries</p>
              </div>
              <Switch
                checked={notifications.types.weeklyReport}
                onCheckedChange={(value) => updateNotificationTypes('weeklyReport', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">App Blocked</Label>
                <p className="text-sm text-muted-foreground">When trying to access blocked applications</p>
              </div>
              <Switch
                checked={notifications.types.appBlocked}
                onCheckedChange={(value) => updateNotificationTypes('appBlocked', value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiet Hours */}
      {notifications.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Quiet Hours</span>
            </CardTitle>
            <CardDescription>
              Set hours when notifications should be silenced
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Enable Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Silence notifications during specified hours</p>
              </div>
              <Switch
                checked={notifications.quietHours.enabled}
                onCheckedChange={(value) => updateQuietHours({ enabled: value })}
              />
            </div>

            {notifications.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={notifications.quietHours.start}
                    onChange={(e) => updateQuietHours({ start: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={notifications.quietHours.end}
                    onChange={(e) => updateQuietHours({ end: e.target.value })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSettingsComponent;
