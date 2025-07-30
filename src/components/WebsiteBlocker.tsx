
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Shield, Plus, X, Globe, Clock } from 'lucide-react';
import { BlockedSite } from '@/hooks/useProductivitySettings';

interface WebsiteBlockerProps {
  blockedSites: BlockedSite[];
  onToggleSite: (url: string) => void;
  onAddSite: (url: string, category: BlockedSite['category']) => void;
}

const WebsiteBlocker: React.FC<WebsiteBlockerProps> = ({ 
  blockedSites, 
  onToggleSite, 
  onAddSite 
}) => {
  const [newSite, setNewSite] = useState('');
  const [newCategory, setNewCategory] = useState<BlockedSite['category']>('social');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSite = () => {
    if (newSite.trim()) {
      onAddSite(newSite.trim(), newCategory);
      setNewSite('');
      setShowAddForm(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return '👥';
      case 'entertainment': return '🎬';
      case 'news': return '📰';
      default: return '🌐';
    }
  };

  const activeSites = blockedSites.filter(site => site.isActive);
  const inactiveSites = blockedSites.filter(site => !site.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold">Website Blocker</h2>
        </div>
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Site
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium">Currently Blocked</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{activeSites.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">Allowed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{inactiveSites.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Active Since</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">2h 15m</div>
        </Card>
      </div>

      {/* Add Site Form */}
      {showAddForm && (
        <Card className="p-4 border-2 border-primary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Add New Blocked Site</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="example.com"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
              />
              <select 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as BlockedSite['category'])}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="social">Social Media</option>
                <option value="entertainment">Entertainment</option>
                <option value="news">News</option>
                <option value="other">Other</option>
              </select>
              <Button onClick={handleAddSite}>Add Site</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Blocked Sites List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Blocked Websites</h3>
        <div className="space-y-3">
          {blockedSites.map((site, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getCategoryIcon(site.category)}</span>
                <div>
                  <div className="font-medium">{site.url}</div>
                  <div className="text-sm text-muted-foreground capitalize">{site.category}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  site.isActive 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {site.isActive ? 'Blocked' : 'Allowed'}
                </span>
                <Switch
                  checked={site.isActive}
                  onCheckedChange={() => onToggleSite(site.url)}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => blockedSites.forEach(site => onToggleSite(site.url))}>
          <Shield className="h-4 w-4 mr-2" />
          Block All Social Media
        </Button>
        <Button variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Schedule Blocking
        </Button>
      </div>
    </div>
  );
};

export default WebsiteBlocker;
