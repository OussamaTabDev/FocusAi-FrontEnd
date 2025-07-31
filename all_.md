
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Settings, Plus, Trash2, Edit } from 'lucide-react';

interface FocusRule {
  id: string;
  name: string;
  duration: number;
  blockedApps: string[];
  strictMode: boolean;
}

const FocusMode = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [selectedRule, setSelectedRule] = useState('deep-work');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<FocusRule | null>(null);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDuration, setNewRuleDuration] = useState(25);
  const [newRuleApps, setNewRuleApps] = useState('');
  const [newRuleStrict, setNewRuleStrict] = useState(false);

  // All available focus rules
  const [allFocusRules, setAllFocusRules] = useState<Record<string, FocusRule>>({
    'deep-work': {
      id: 'deep-work',
      name: 'Deep Work',
      duration: 90,
      blockedApps: ['YouTube', 'Facebook', 'Twitter', 'Instagram', 'TikTok'],
      strictMode: true
    },
    'light-focus': {
      id: 'light-focus',
      name: 'Light Focus',
      duration: 45,
      blockedApps: ['YouTube', 'Facebook', 'TikTok'],
      strictMode: false
    },
    'meeting-mode': {
      id: 'meeting-mode',
      name: 'Meeting Mode',
      duration: 60,
      blockedApps: ['YouTube', 'Games', 'Social Media'],
      strictMode: false
    },
    'study-mode': {
      id: 'study-mode',
      name: 'Study Mode',
      duration: 120,
      blockedApps: ['YouTube', 'Facebook', 'Twitter', 'Instagram', 'TikTok', 'Games'],
      strictMode: true
    },
    'writing-mode': {
      id: 'writing-mode',
      name: 'Writing Mode',
      duration: 60,
      blockedApps: ['YouTube', 'Social Media', 'News'],
      strictMode: false
    }
  });

  // Selected rules to show (only 3)
  const [selectedRulesForDisplay, setSelectedRulesForDisplay] = useState<string[]>([
    'deep-work', 'light-focus', 'meeting-mode'
  ]);

  // Get the displayed rules
  const displayedRules = selectedRulesForDisplay.reduce((acc, key) => {
    if (allFocusRules[key]) {
      acc[key] = allFocusRules[key];
    }
    return acc;
  }, {} as Record<string, FocusRule>);

  const currentRule = allFocusRules[selectedRule];
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddRule = () => {
    if (!newRuleName.trim()) return;
    
    const id = newRuleName.toLowerCase().replace(/\s+/g, '-');
    const apps = newRuleApps.split(',').map(app => app.trim()).filter(app => app);
    
    setAllFocusRules(prev => ({
      ...prev,
      [id]: {
        id,
        name: newRuleName,
        duration: newRuleDuration,
        blockedApps: apps,
        strictMode: newRuleStrict
      }
    }));
    
    // Reset form
    setNewRuleName('');
    setNewRuleDuration(25);
    setNewRuleApps('');
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
    setNewRuleApps(rule.blockedApps.join(', '));
    setNewRuleStrict(rule.strictMode);
  };

  const handleUpdateRule = () => {
    if (!editingRule || !newRuleName.trim()) return;
    
    const apps = newRuleApps.split(',').map(app => app.trim()).filter(app => app);
    
    setAllFocusRules(prev => ({
      ...prev,
      [editingRule.id]: {
        ...editingRule,
        name: newRuleName,
        duration: newRuleDuration,
        blockedApps: apps,
        strictMode: newRuleStrict
      }
    }));
    
    setEditingRule(null);
    setNewRuleName('');
    setNewRuleDuration(25); 
    setNewRuleApps('');
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
            <Button variant="outline" size="sm">
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
                    <Label htmlFor="rule-apps">Blocked Apps (comma-separated)</Label>
                    <Input
                      id="rule-apps"
                      value={newRuleApps}
                      onChange={(e) => setNewRuleApps(e.target.value)}
                      placeholder="YouTube, Facebook, Twitter"
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
                    <Label htmlFor="rule-strict">Strict Mode</Label>
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
                        setNewRuleApps('');
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
                            {rule.duration}min • {rule.blockedApps.length} apps blocked • {rule.strictMode ? 'Strict' : 'Flexible'}
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
          <div className="text-muted-foreground">Focus Session</div>
        </div>
        
        <Progress value={progress} className="h-2 mb-6" />
        
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className="min-w-[100px]"
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button variant="outline">
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
              onClick={() => setSelectedRule(key)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedRule === key
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
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
      </Card>

      {/* Currently Blocked */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Currently Blocked Applications</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {currentRule?.blockedApps.map((app, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-950 rounded">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">{app}</span>
            </div>
          )) || <div className="text-muted-foreground">No rule selected</div>}
        </div>
      </Card>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Today's Sessions</div>
          <div className="text-2xl font-bold">4</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Focus Time</div>
          <div className="text-2xl font-bold">3h 45m</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Longest Streak</div>
          <div className="text-2xl font-bold">1h 52m</div>
        </Card>
      </div>
    </div>
  );
};

export default FocusMode;

--
the session (Focus Session) time left , if i select like deep work it's change to this new duration (if i click play , i can change nothing) till the time ==0 or i stop the session , and (i have some api to work with them) 
--
focus: (focusType) => fetch(`${API}/api/modes/focus/${focusType}`, { method: 'POST' }),
  getSettings: (modeKey) => fetch(`${API}/api/modes/settings/${modeKey}`).then(r => r.json()),
  updateSetting: (modeKey, setting, value) => fetch(`${API}/api/modes/settings/${modeKey}/${setting}`, { 
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  }),
  listModes: () => fetch(`${API}/api/modes/modes`).then(r => r.json()),
  startTimer: (duration) => fetch(`${API}/api/modes/timer/start`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration })
  }),
  stopTimer: () => fetch(`${API}/api/modes/timer/stop`, { method: 'POST' }),
  timerStatus: () => fetch(`${API}/api/modes/timer/status`).then(r => r.json()),
--
this in backend 

@bp.route("/focus/<focus_type>", methods=["POST"])
def focus_mode(focus_type: str):
    ok = _controller.switch_to_focus(FocusType[focus_type.upper()])
    return jsonify({"success": ok})
# ------------------------------------------------------------------
# Settings retrieval & update
# ------------------------------------------------------------------
@bp.route("/settings/<mode_key>", methods=["GET"])
def get_settings(mode_key: str):
    settings = _controller.settings_manager.get_mode_setting(mode_key)
    if not settings:
        return jsonify({"error": "not found"}), 404
    return jsonify(settings.__dict__)

@bp.route("/settings/<mode_key>/<setting>", methods=["PUT"])
def update_setting(mode_key: str, setting: str):
    body = request.get_json(force=True)
    new_value = body["value"]
    try:
        _controller.settings_manager.update_mode_setting(mode_key, setting, new_value)
        return jsonify({"message": "updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# ------------------------------------------------------------------
# Available modes
# ------------------------------------------------------------------
@bp.route("/modes", methods=["GET"])
def list_modes():
    return jsonify(_controller.settings_manager.list_available_modes())


# ------------------------------------------------------------------
# Timer (kids-mode time-limit) endpoints
# ------------------------------------------------------------------
@bp.route("/timer/start", methods=["POST"])
def start_timer():
    """Start kids-mode timer via REST."""
    body = request.get_json(force=True)
    mins   = float(body.get("minutes", 60))
    action = body.get("action", "sleep")
    warn   = body.get("warning", False)
    grace  = float(body.get("grace_seconds", 10))

    import threading
    threading.Thread(
        target=_controller.device_controller._checking_loop,
        args=(mins, action, warn, grace),
        daemon=True
    ).start()
    return jsonify({"message": f"Timer started for {mins} min"})

@bp.route("/timer/stop", methods=["POST"])
def stop_timer():
    _controller.device_controller.stop()
    return jsonify({"message": "Timer stopped"})

@bp.route("/timer/status", methods=["GET"])
def timer_status():
    dc = _controller.device_controller
    return jsonify({
        "is_timing": dc.is_timing,
        "elapsed_seconds": dc.elapsed(),
        "time_limit": dc.time_limit,
        "action": dc.action,
        "warning": dc.is_warning
    })

--  