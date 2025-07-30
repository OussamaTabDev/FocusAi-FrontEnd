
import React from 'react';
import { Monitor, Shield, Zap, Camera, Activity, Database } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { AdvancedSettings, useAdvancedSettings } from '@/hooks/useAdvancedSettings';

const AdvancedSettingsComponent: React.FC = () => {
  const { advanced, setAdvanced } = useAdvancedSettings();

  const updateMonitoring = (updates: Partial<AdvancedSettings['monitoring']>) => {
    setAdvanced({
      ...advanced,
      monitoring: { ...advanced.monitoring, ...updates }
    });
  };

  const updatePrivacy = (updates: Partial<AdvancedSettings['privacy']>) => {
    setAdvanced({
      ...advanced,
      privacy: { ...advanced.privacy, ...updates }
    });
  };

  const updatePerformance = (updates: Partial<AdvancedSettings['performance']>) => {
    setAdvanced({
      ...advanced,
      performance: { ...advanced.performance, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      {/* Monitoring Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Monitoring</span>
          </CardTitle>
          <CardDescription>
            Configure how the application tracks your activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Idle Threshold</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Time of inactivity before considering you idle: {advanced.monitoring.idleThreshold} minutes
            </p>
            <Slider
              value={[advanced.monitoring.idleThreshold]}
              onValueChange={([value]) => updateMonitoring({ idleThreshold: value })}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 min</span>
              <span>30 min</span>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Screenshot Interval</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Capture screenshots every {advanced.monitoring.screenshotInterval || 'disabled'} 
              {advanced.monitoring.screenshotInterval ? ' minutes' : ''}
            </p>
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <Slider
                value={[advanced.monitoring.screenshotInterval]}
                onValueChange={([value]) => updateMonitoring({ screenshotInterval: value })}
                max={60}
                min={0}
                step={5}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Disabled</span>
              <span>60 min</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Accurate Time Tracking</Label>
              <p className="text-sm text-muted-foreground">Use advanced algorithms for precise tracking</p>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <Switch
                checked={advanced.monitoring.accurateTimeTracking}
                onCheckedChange={(value) => updateMonitoring({ accurateTimeTracking: value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Track Keystrokes</Label>
              <p className="text-sm text-muted-foreground">Monitor typing activity for productivity analysis</p>
            </div>
            <Switch
              checked={advanced.monitoring.trackKeystrokes}
              onCheckedChange={(value) => updateMonitoring({ trackKeystrokes: value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy</span>
          </CardTitle>
          <CardDescription>
            Control how your data is stored and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Data Retention</Label>
            <Select
              value={advanced.privacy.dataRetention.toString()}
              onValueChange={(value) => updatePrivacy({ dataRetention: parseInt(value) })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">6 months</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="0">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Anonymize Data</Label>
              <p className="text-sm text-muted-foreground">Remove personal identifiers from stored data</p>
            </div>
            <Switch
              checked={advanced.privacy.anonymizeData}
              onCheckedChange={(value) => updatePrivacy({ anonymizeData: value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Share Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve the app by sharing anonymous usage data</p>
            </div>
            <Switch
              checked={advanced.privacy.shareAnalytics}
              onCheckedChange={(value) => updatePrivacy({ shareAnalytics: value })}
            />
          </div>

          <div className="p-4 border border-yellow-200 dark:border-yellow-800 rounded-lg bg-yellow-50 dark:bg-yellow-950">
            <div className="flex items-start space-x-2">
              <Database className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Data Security
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  All data is encrypted and stored locally on your device. We never send your activity data to external servers without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Performance</span>
          </CardTitle>
          <CardDescription>
            Optimize application performance and system integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Auto Start</Label>
              <p className="text-sm text-muted-foreground">Launch FocusAi Tracker when system starts</p>
            </div>
            <Switch
              checked={advanced.performance.autoStart}
              onCheckedChange={(value) => updatePerformance({ autoStart: value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Minimize to Tray</Label>
              <p className="text-sm text-muted-foreground">Keep running in background when window is closed</p>
            </div>
            <Switch
              checked={advanced.performance.minimizeToTray}
              onCheckedChange={(value) => updatePerformance({ minimizeToTray: value })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Low Power Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce CPU usage and battery consumption</p>
            </div>
            <Switch
              checked={advanced.performance.lowPowerMode}
              onCheckedChange={(value) => updatePerformance({ lowPowerMode: value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettingsComponent;
