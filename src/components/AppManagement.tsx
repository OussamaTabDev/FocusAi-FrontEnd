
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Monitor, Plus, Edit, Trash2, Activity, Square, AlertCircle } from 'lucide-react';

interface App {
  id: string;
  name: string;
  category: 'productive' | 'entertainment' | 'social' | 'development' | 'other';
  isMonitored: boolean;
  isRunning: boolean;
  timeSpent: number; // in minutes
  lastUsed: Date;
}

const AppManagement: React.FC = () => {
  const [apps, setApps] = useState<App[]>([
    {
      id: '1',
      name: 'Visual Studio Code',
      category: 'development',
      isMonitored: true,
      isRunning: true,
      timeSpent: 245,
      lastUsed: new Date()
    },
    {
      id: '2',
      name: 'Google Chrome',
      category: 'productive',
      isMonitored: true,
      isRunning: false,
      timeSpent: 180,
      lastUsed: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Spotify',
      category: 'entertainment',
      isMonitored: false,
      isRunning: true,
      timeSpent: 95,
      lastUsed: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Figma',
      category: 'development',
      isMonitored: true,
      isRunning: false,
      timeSpent: 120,
      lastUsed: new Date(Date.now() - 60 * 60 * 1000)
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [newApp, setNewApp] = useState({
    name: '',
    category: 'productive' as App['category']
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'development': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'entertainment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'social': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatLastUsed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const handleAddApp = () => {
    if (newApp.name.trim()) {
      const app: App = {
        id: Date.now().toString(),
        name: newApp.name,
        category: newApp.category,
        isMonitored: true,
        isRunning: false,
        timeSpent: 0,
        lastUsed: new Date()
      };
      setApps([...apps, app]);
      setNewApp({ name: '', category: 'productive' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditApp = () => {
    if (editingApp) {
      setApps(apps.map(app => app.id === editingApp.id ? editingApp : app));
      setIsEditDialogOpen(false);
      setEditingApp(null);
    }
  };

  const handleDeleteApp = (id: string) => {
    setApps(apps.filter(app => app.id !== id));
  };

  const toggleMonitoring = (id: string) => {
    setApps(apps.map(app => 
      app.id === id ? { ...app, isMonitored: !app.isMonitored } : app
    ));
  };

  const monitoredApps = apps.filter(app => app.isMonitored);
  const runningApps = apps.filter(app => app.isRunning);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Monitor className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">App Management</h2>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add App
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New App</DialogTitle>
              <DialogDescription>
                Add a new application to monitor its usage.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="App name (e.g., Visual Studio Code)"
                value={newApp.name}
                onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
              />
              <select 
                value={newApp.category}
                onChange={(e) => setNewApp({ ...newApp, category: e.target.value as App['category'] })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="productive">Productive</option>
                <option value="development">Development</option>
                <option value="entertainment">Entertainment</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddApp}>Add App</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Monitor className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Total Apps</span>
          </div>
          <div className="text-2xl font-bold">{apps.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="font-medium">Monitored</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{monitoredApps.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Running</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{runningApps.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="font-medium">Not Monitored</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{apps.length - monitoredApps.length}</div>
        </Card>
      </div>

      {/* Apps Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Applications</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>App Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time Spent</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Monitored</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${app.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{app.name}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(app.category)}>
                    {app.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={app.isRunning ? 'default' : 'secondary'}>
                    {app.isRunning ? 'Running' : 'Stopped'}
                  </Badge>
                </TableCell>
                <TableCell>{formatTime(app.timeSpent)}</TableCell>
                <TableCell>{formatLastUsed(app.lastUsed)}</TableCell>
                <TableCell>
                  <Switch
                    checked={app.isMonitored}
                    onCheckedChange={() => toggleMonitoring(app.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingApp(app);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteApp(app.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit App</DialogTitle>
            <DialogDescription>
              Modify the application details.
            </DialogDescription>
          </DialogHeader>
          {editingApp && (
            <div className="space-y-4">
              <Input
                placeholder="App name"
                value={editingApp.name}
                onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
              />
              <select 
                value={editingApp.category}
                onChange={(e) => setEditingApp({ ...editingApp, category: e.target.value as App['category'] })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="productive">Productive</option>
                <option value="development">Development</option>
                <option value="entertainment">Entertainment</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditApp}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppManagement;
