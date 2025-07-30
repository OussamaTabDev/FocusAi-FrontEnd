import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';

const KidsModeSettings = () => {
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [dailyLimit, setDailyLimit] = useState('4');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('20:00');
  const [weekendExtension, setWeekendExtension] = useState(true);
  const [activityReports, setActivityReports] = useState(true);

  // Load current passcode (for display purposes only - never show actual passcode)
  useEffect(() => {
    const savedPasscode = localStorage.getItem('kids-mode-passcode') || '1234';
    setPasscode(savedPasscode);
    setConfirmPasscode(savedPasscode);
  }, []);

  const handleSavePasscode = () => {
    if (passcode !== confirmPasscode) {
      alert('Passcodes do not match!');
      return;
    }
    
    if (passcode.length !== 4 || !/^\d{4}$/.test(passcode)) {
      alert('Passcode must be exactly 4 digits!');
      return;
    }

    localStorage.setItem('kids-mode-passcode', passcode);
    alert('Passcode updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="daily-limit" className="text-base font-medium">Daily Screen Time Limit</Label>
        <div className="mt-1 flex items-center space-x-2">
          <Input 
            id="daily-limit" 
            type="number" 
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            className="w-20" 
          />
          <span className="text-sm text-muted-foreground">hours per day</span>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Allowed Hours</Label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-time" className="text-sm">Start Time</Label>
            <Input 
              id="start-time" 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="end-time" className="text-sm">End Time</Label>
            <Input 
              id="end-time" 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">Weekend Extensions</Label>
          <p className="text-sm text-muted-foreground">Allow 2 extra hours on weekends</p>
        </div>
        <Switch 
          checked={weekendExtension}
          onCheckedChange={setWeekendExtension}
        />
      </div>

      {/* Enhanced Passcode Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-300 dark:border-blue-700">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
          <Label className="text-base font-medium text-blue-700 dark:text-blue-300">Parental Passcode</Label>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-passcode" className="text-sm">New 4-Digit Passcode</Label>
            <div className="relative mt-1">
              <Input 
                id="new-passcode"
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.slice(0, 4))}
                placeholder="Enter 4-digit passcode"
                className="pr-10"
                maxLength={4}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPasscode(!showPasscode)}
              >
                {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirm-passcode" className="text-sm">Confirm Passcode</Label>
            <Input 
              id="confirm-passcode"
              type={showPasscode ? "text" : "password"}
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value.slice(0, 4))}
              placeholder="Confirm 4-digit passcode"
              className="mt-1"
              maxLength={4}
            />
          </div>
          
          <Button 
            onClick={handleSavePasscode}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Update Passcode
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            ⚠️ This passcode is required to switch from Kids Mode back to Standard Mode. Keep it secure!
          </p>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">Activity Reports</Label>
          <p className="text-sm text-muted-foreground">Send daily activity summary to parents</p>
        </div>
        <Switch 
          checked={activityReports}
          onCheckedChange={setActivityReports}
        />
      </div>
    </div>
  );
};

export default KidsModeSettings;