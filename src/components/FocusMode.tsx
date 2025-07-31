import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Settings, Plus, Trash2, Edit } from 'lucide-react';
import { modes } from '@/lib/tracker_api'; 

interface FocusRule {
  id: string;
  name: string;
  duration: number;
  blockedApps: string[];
  allowedApps: string[];
  minimizedApps: string[];
  strictMode: boolean;
}

const FocusMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalDuration, setTotalDuration] = useState(25 * 60); // Total session duration
  const [selectedRule, setSelectedRule] = useState('deep-work');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FocusRule | null>(null);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDuration, setNewRuleDuration] = useState(25);
  const [newRuleBlockedApps, setNewRuleBlockedApps] = useState('');
  const [newRuleAllowedApps, setNewRuleAllowedApps] = useState('');
  const [newRuleMinimizedApps, setNewRuleMinimizedApps] = useState('');
  const [newRuleStrict, setNewRuleStrict] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [settings, setSettings] = useState([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusCheckRef = useRef<NodeJS.Timeout | null>(null);

  // All available focus rules
  const [allFocusRules, setAllFocusRules] = useState<Record<string, FocusRule>>({
    'deep-work': {
      id: 'deep-work',
      name: 'Deep Work',
      duration: 90,
      blockedApps: ['Discord', 'Steam', 'Spotify', 'Facebook', 'Reddit', 'Twitter', 'WhatsApp'],
      allowedApps: ['Visual Studio Code', 'Notion', 'Slack', 'Figma', 'Obsidian', 'Microsoft Teams', 'Trello'],
      minimizedApps: ['VLC Media Player', 'YouTube'],
      strictMode: true
    },
    'light-focus': {
      id: 'light-focus',
      name: 'Light Focus',
      duration: 45,
      blockedApps: ['Facebook', 'TikTok', 'Instagram'],
      allowedApps: ['Visual Studio Code', 'Notion', 'Slack', 'YouTube', 'Spotify'],
      minimizedApps: ['Discord'],
      strictMode: false
    },
    'meeting-mode': {
      id: 'meeting-mode',
      name: 'Meeting Mode',
      duration: 60,
      blockedApps: ['Games', 'Social Media', 'Entertainment'],
      allowedApps: ['Microsoft Teams', 'Zoom', 'Slack', 'Notion', 'Calendar'],
      minimizedApps: ['YouTube', 'Spotify'],
      strictMode: false
    },
    'study-mode': {
      id: 'study-mode',
      name: 'Study Mode',
      duration: 120,
      blockedApps: ['YouTube', 'Facebook', 'Twitter', 'Instagram', 'TikTok', 'Games', 'Discord'],
      allowedApps: ['Notion', 'Obsidian', 'Anki', 'PDF Reader', 'Calculator'],
      minimizedApps: ['Spotify'],
      strictMode: true
    },
    'writing-mode': {
      id: 'writing-mode',
      name: 'Writing Mode',
      duration: 60,
      blockedApps: ['Social Media', 'News', 'Entertainment'],
      allowedApps: ['Notion', 'Google Docs', 'Scrivener', 'Grammarly'],
      minimizedApps: ['YouTube', 'Spotify'],
      strictMode: false
    }
  });

  // Selected rules to show (only 3)
  const [selectedRulesForDisplay, setSelectedRulesForDisplay] = useState<string[]>([
    'deep-work', 'light-focus', 'meeting-mode'
  ]);

  // Session statistics
  const [sessionStats, setSessionStats] = useState({
    todaySessions: 0,
    totalFocusTime: '0h 0m',
    currentStreak: 0
  });

  // Get the displayed rules
  const displayedRules = selectedRulesForDisplay.reduce((acc, key) => {
    if (allFocusRules[key]) {
      acc[key] = allFocusRules[key];
    }
    return acc;
  }, {} as Record<string, FocusRule>);

  const currentRule = allFocusRules[selectedRule];
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  // Generate mode key for API calls
  const generateModeKey = (focusType: string) => {
    const firstWord = focusType.split('-')[0]; // e.g., 'deep' from 'deep-work'
    return `standard_focus_${firstWord}`;
  };

  // Load settings from API
  const loadRuleSettings = async (ruleId: string) => {
    try {
      const modeKey = generateModeKey(ruleId);
      const settings = await modes.getSettings(modeKey);
      
      if (settings && allFocusRules[ruleId]) {
        setAllFocusRules(prev => ({
          ...prev,
          [ruleId]: {
            ...prev[ruleId],
            allowedApps: settings.allowed_apps || prev[ruleId].allowedApps,
            blockedApps: settings.blocked_apps || prev[ruleId].blockedApps,
            minimizedApps: settings.minimized_apps || prev[ruleId].minimizedApps,
            duration: settings.duration || prev[ruleId].duration,
            strictMode: settings.distraction_blocker || prev[ruleId].strictMode
          }
        }));
      }
    } catch (error) {
      console.error('Error loading rule settings:', error);
    }
  };

  // Save settings to API
  const saveRuleSettings = async (rule: FocusRule) => {
    try {
      const modeKey = generateModeKey(rule.id);
      
      await Promise.all([
        modes.updateSetting(modeKey, 'allowed_apps', rule.allowedApps),
        modes.updateSetting(modeKey, 'blocked_apps', rule.blockedApps),
        modes.updateSetting(modeKey, 'minimized_apps', rule.minimizedApps),
        modes.updateSetting(modeKey, 'duration', rule.duration),
        modes.updateSetting(modeKey, 'distraction_blocker', rule.strictMode)
      ]);
    } catch (error) {
      console.error('Error saving rule settings:', error);
    }
  };

  // Check timer status periodically when session is active
  const checkTimerStatus = async () => {
    try {
      const status = await modes.timerStatus();
      if (status.is_timing) {
        const remainingTime = Math.max(0, (status.time_limit * 60) - status.elapsed_seconds);
        setTimeLeft(Math.floor(remainingTime));
        setIsRunning(true);
        
        if (remainingTime <= 0) {
          handleTimerComplete();
        }
      } else {
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Error checking timer status:', error);
    }
  };

  // Start checking timer status when session becomes active
  useEffect(() => {
    if (sessionActive) {
      statusCheckRef.current = setInterval(checkTimerStatus, 1000);
      return () => {
        if (statusCheckRef.current) {
          clearInterval(statusCheckRef.current);
        }
      };
    }
  }, [sessionActive]);

  // Load initial settings
  useEffect(() => {
    const loadAllSettings = async () => {
      for (const ruleId of Object.keys(allFocusRules)) {
        await loadRuleSettings(ruleId);
      }
    };
    loadAllSettings();
  }, []);

  // Handle timer completion
  const handleTimerComplete = async () => {
    setIsRunning(false);
    setSessionActive(false);
    setTimeLeft(0);
    
    // Switch back to standard mode
    try {
      await modes.standard();
    } catch (error) {
      console.error('Error switching to standard mode:', error);
    }
    
    // Reset to original duration for next session
    if (currentRule) {
      setTimeLeft(currentRule.duration * 60);
      setTotalDuration(currentRule.duration * 60);
    }
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      todaySessions: prev.todaySessions + 1,
      currentStreak: prev.currentStreak + 1
    }));
    
    console.log('Focus session completed!');
  };

  // Handle rule selection (only when not running)
  const handleRuleSelection = (ruleKey: string) => {
    if (sessionActive) return; // Prevent changing during active session
    
    setSelectedRule(ruleKey);
    const rule = allFocusRules[ruleKey];
    if (rule) {
      const newDuration = rule.duration * 60;
      setTimeLeft(newDuration);
      setTotalDuration(newDuration);
    }
  };

  // Start focus session
  const handleStart = async () => {
    try {
      if (!sessionActive) {
        // Starting new session
        const rule = allFocusRules[selectedRule];
        if (!rule) return;

        // Convert rule ID to focus type (e.g., 'deep-work' -> 'deep_work')
        const focusType = selectedRule.replace('-', '_');
        
        // Start focus mode on backend
        await modes.focus(focusType);
        
        // Start timer on backend
        await modes.startTimer(rule.duration);
        
        setSessionActive(true);
        setIsRunning(true);
        setTotalDuration(rule.duration * 60);
        setTimeLeft(rule.duration * 60);
      } else {
        // Resume existing session
        setIsRunning(true);
      }
    } catch (error) {
      console.error('Error starting focus session:', error);
    }
  };

  // Pause focus session
  const handlePause = () => {
    setIsRunning(false);
    // Note: Backend doesn't seem to have pause functionality, 
    // so we just pause the UI updates
  };

  // Stop focus session
  const handleStop = async () => {
    try {
      await modes.stopTimer();
      
      // Switch back to standard mode
      await modes.standard();
      
      setIsRunning(false);
      setSessionActive(false);
      
      // Reset timer to original duration
      if (currentRule) {
        const originalDuration = currentRule.duration * 60;
        setTimeLeft(originalDuration);
        setTotalDuration(originalDuration);
      }
    } catch (error) {
      console.error('Error stopping focus session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddRule = async () => {
    if (!newRuleName.trim()) return;
    
    const id = newRuleName.toLowerCase().replace(/\s+/g, '-');
    const blockedApps = newRuleBlockedApps.split(',').map(app => app.trim()).filter(app => app);
    const allowedApps = newRuleAllowedApps.split(',').map(app => app.trim()).filter(app => app);
    const minimizedApps = newRuleMinimizedApps.split(',').map(app => app.trim()).filter(app => app);
    
    const newRule: FocusRule = {
      id,
      name: newRuleName,
      duration: newRuleDuration,
      blockedApps,
      allowedApps,
      minimizedApps,
      strictMode: newRuleStrict
    };
    
    setAllFocusRules(prev => ({
      ...prev,
      [id]: newRule
    }));
    
    // Save to API
    await saveRuleSettings(newRule);
    
    // Reset form
    setNewRuleName('');
    setNewRuleDuration(25);
    setNewRuleBlockedApps('');
    setNewRuleAllowedApps('');
    setNewRuleMinimizedApps('');
    setNewRuleStrict(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    setAllFocusRules(prev => {
      const newRules = { ...prev };
      delete newRules[ruleId];
      return newRules;
    });
    
    // Remove from selected display if it was selected
    setSelectedRulesForDisplay(prev => prev.filter(id => id !== ruleId));
    
    // Change selected rule if it was deleted
    if (selectedRule === ruleId) {
      const remainingKeys = Object.keys(allFocusRules).filter(key => key !== ruleId);
      setSelectedRule(remainingKeys[0] || '');
    }
  };

  const handleEditRule = (rule: FocusRule) => {
    setEditingRule(rule);
    setNewRuleName(rule.name);
    setNewRuleDuration(rule.duration);
    setNewRuleBlockedApps(rule.blockedApps.join(', '));
    setNewRuleAllowedApps(rule.allowedApps.join(', '));
    setNewRuleMinimizedApps(rule.minimizedApps.join(', '));
    setNewRuleStrict(rule.strictMode);
  };

  const handleUpdateRule = async () => {
    if (!editingRule || !newRuleName.trim()) return;
    
    const blockedApps = newRuleBlockedApps.split(',').map(app => app.trim()).filter(app => app);
    const allowedApps = newRuleAllowedApps.split(',').map(app => app.trim()).filter(app => app);
    const minimizedApps = newRuleMinimizedApps.split(',').map(app => app.trim()).filter(app => app);
    
    const updatedRule: FocusRule = {
      ...editingRule,
      name: newRuleName,
      duration: newRuleDuration,
      blockedApps,
      allowedApps,
      minimizedApps,
      strictMode: newRuleStrict
    };
    
    setAllFocusRules(prev => ({
      ...prev,
      [editingRule.id]: updatedRule
    }));
    
    // Save to API
    await saveRuleSettings(updatedRule);
    
    setEditingRule(null);
    setNewRuleName('');
    setNewRuleDuration(25); 
    setNewRuleBlockedApps('');
    setNewRuleAllowedApps('');
    setNewRuleMinimizedApps('');
    setNewRuleStrict(false);
  };

  const toggleRuleForDisplay = (ruleId: string) => {
    setSelectedRulesForDisplay(prev => {
      if (prev.includes(ruleId)) {
        return prev.filter(id => id !== ruleId);
      } else if (prev.length < 3) {
        return [...prev, ruleId];
      }
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Focus Mode</h2>
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={sessionActive}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure Focus Rules</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Add/Edit Rule Form */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-4">{editingRule ? 'Edit Rule' : 'Add New Rule'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                      placeholder="e.g., Deep Work"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rule-duration">Duration (minutes)</Label>
                    <Input
                      id="rule-duration"
                      type="number"
                      value={newRuleDuration}
                      onChange={(e) => setNewRuleDuration(Number(e.target.value))}
                      placeholder="25"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="rule-blocked-apps">Blocked Apps (comma-separated)</Label>
                    <Input
                      id="rule-blocked-apps"
                      value={newRuleBlockedApps}
                      onChange={(e) => setNewRuleBlockedApps(e.target.value)}
                      placeholder="YouTube, Facebook, Twitter"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="rule-allowed-apps">Allowed Apps (comma-separated)</Label>
                    <Input
                      id="rule-allowed-apps"
                      value={newRuleAllowedApps}
                      onChange={(e) => setNewRuleAllowedApps(e.target.value)}
                      placeholder="Visual Studio Code, Notion, Slack"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="rule-minimized-apps">Minimized Apps (comma-separated)</Label>
                    <Input
                      id="rule-minimized-apps"
                      value={newRuleMinimizedApps}
                      onChange={(e) => setNewRuleMinimizedApps(e.target.value)}
                      placeholder="Spotify, VLC Media Player"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="rule-strict"
                      type="checkbox"
                      checked={newRuleStrict}
                      onChange={(e) => setNewRuleStrict(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="rule-strict">Strict Mode (Only allow listed apps)</Label>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  {editingRule ? (
                    <>
                      <Button onClick={handleUpdateRule}>Update Rule</Button>
                      <Button variant="outline" onClick={() => {
                        setEditingRule(null);
                        setNewRuleName('');
                        setNewRuleDuration(25);
                        setNewRuleBlockedApps('');
                        setNewRuleAllowedApps('');
                        setNewRuleMinimizedApps('');
                        setNewRuleStrict(false);
                      }}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={handleAddRule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  )}
                </div>
              </div>

              {/* All Rules List */}
              <div>
                <h4 className="font-medium mb-4">All Focus Rules</h4>
                <div className="space-y-2">
                  {Object.entries(allFocusRules).map(([key, rule]) => (
                    <div key={key} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedRulesForDisplay.includes(key)}
                          onChange={() => toggleRuleForDisplay(key)}
                          disabled={!selectedRulesForDisplay.includes(key) && selectedRulesForDisplay.length >= 3}
                          className="h-4 w-4"
                        />
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {rule.duration}min • {rule.blockedApps.length} blocked, {rule.allowedApps.length} allowed • {rule.strictMode ? 'Strict' : 'Flexible'}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRule(key)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Select up to 3 rules to display in the main interface. Currently selected: {selectedRulesForDisplay.length}/3
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timer Display */}
      <Card className="p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl font-mono font-bold mb-2">{formatTime(timeLeft)}</div>
          <div className="text-muted-foreground">
            {sessionActive ? `${currentRule?.name} Session` : 'Focus Session'}
          </div>
          {sessionActive && (
            <div className="text-sm text-muted-foreground mt-1">
              Session active - rule selection locked
            </div>
          )}
        </div>
        
        <Progress value={progress} className="h-2 mb-6" />
        
        <div className="flex justify-center space-x-2">
          <Button
            onClick={isRunning ? handlePause : handleStart}
            className="min-w-[100px]"
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="outline" onClick={handleStop} disabled={!sessionActive}>
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      </Card>

      {/* Focus Rules */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Focus Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {Object.entries(displayedRules).map(([key, rule]) => (
            <div
              key={key}
              onClick={() => handleRuleSelection(key)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                sessionActive 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:border-primary/50'
              } ${
                selectedRule === key
                  ? 'border-primary bg-primary/10'
                  : 'border-border'
              }`}
            >
              <div className="font-medium">{rule.name}</div>
              <div className="text-sm text-muted-foreground">{rule.duration}min session</div>
              <div className="text-xs mt-1">
                {rule.strictMode ? '🔒 Strict Mode' : '⚡ Flexible'}
              </div>
            </div>
          ))}
        </div>
        {sessionActive && (
          <p className="text-sm text-orange-600">
            Rule selection is locked during active focus session
          </p>
        )}
      </Card>

      {/* Currently Managed Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blocked Apps */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Blocked Applications</h3>
          <div className="space-y-2">
            {currentRule?.blockedApps.map((app, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm">{app}</span>
              </div>
            )) || <div className="text-muted-foreground">No apps blocked</div>}
          </div>
        </Card>

        {/* Allowed Apps */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {currentRule?.strictMode ? 'Only Allowed Applications' : 'Prioritized Applications'}
          </h3>
          <div className="space-y-2">
            {currentRule?.allowedApps.map((app, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950 rounded">
                <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm">{app}</span>
              </div>
            )) || <div className="text-muted-foreground">No apps specified</div>}
          </div>
          {currentRule?.strictMode && (
            <p className="text-xs text-orange-600 mt-2">
              🔒 Strict Mode: Only these applications are accessible
            </p>
          )}
        </Card>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Today's Sessions</div>
          <div className="text-2xl font-bold">{sessionStats.todaySessions}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Focus Time</div>
          <div className="text-2xl font-bold">{sessionStats.totalFocusTime}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Current Session</div>
          <div className="text-2xl font-bold">
            {sessionActive ? (
              <span className="text-green-600">Active</span>
            ) : (
              <span className="text-gray-500">Inactive</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FocusMode;