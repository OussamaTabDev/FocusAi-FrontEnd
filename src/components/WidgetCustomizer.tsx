import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, X, Grid, Timer, StickyNote, Cloud, Target, Calendar, Image, AlertTriangle, Quote, Monitor, Bookmark, Smile, CheckSquare, Music, Battery } from 'lucide-react';

interface Widget {
  id: string;
  type: string;
  title: string;
  component: React.ComponentType<any>;
  size: 'small' | 'medium' | 'large';
}

interface WidgetCustomizerProps {
  availableWidgets: Widget[];
  activeWidgets: Widget[];
  onAddWidget: (widget: Widget) => void;
  onRemoveWidget: (id: string) => void;
}

const WidgetCustomizer: React.FC<WidgetCustomizerProps> = ({
  availableWidgets,
  activeWidgets,
  onAddWidget,
  onRemoveWidget
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'pomodoro': return <Timer className="h-5 w-5" />;
      case 'quick-notes': return <StickyNote className="h-5 w-5" />;
      case 'weather': return <Cloud className="h-5 w-5" />;
      case 'productivity-score': return <Target className="h-5 w-5" />;
      case 'habit-tracker': return <Calendar className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      case 'distraction-counter': return <AlertTriangle className="h-5 w-5" />;
      case 'quote': return <Quote className="h-5 w-5" />;
      case 'system-stats': return <Monitor className="h-5 w-5" />;
      case 'bookmarks': return <Bookmark className="h-5 w-5" />;
      case 'mood-tracker': return <Smile className="h-5 w-5" />;
      case 'calendar-integration': return <Calendar className="h-5 w-5" />;
      case 'task-management': return <CheckSquare className="h-5 w-5" />;
      case 'focus-music': return <Music className="h-5 w-5" />;
      case 'screen-time-goals': return <Monitor className="h-5 w-5" />;
      case 'energy-tracker': return <Battery className="h-5 w-5" />;
      default: return <Grid className="h-5 w-5" />;
    }
  };

  const isWidgetActive = (widgetType: string) => {
    return activeWidgets.some(widget => widget.type === widgetType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize Widgets
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize Your Dashboard</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 ">
          <div>
            <h3 className="font-semibold mb-3">Active Widgets</h3>
            <div className="grid grid-cols-3 gap-2">
              {activeWidgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getWidgetIcon(widget.type)}
                    <span className="text-sm">{widget.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveWidget(widget.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {activeWidgets.length === 0 && (
              <p className="text-muted-foreground text-sm">No active widgets</p>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Available Widgets</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableWidgets
                // hide anything whose type is already in activeWidgets
                .filter(w => !activeWidgets.some(a => a.type === w.type))
                .map((widget) => (
                  <div
                    key={widget.type}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      {getWidgetIcon(widget.type)}
                      <span className="text-sm">{widget.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddWidget(widget)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
            {availableWidgets.filter(w => !activeWidgets.some(a => a.type === w.type))
                .length === 0 && (
              <p className="text-muted-foreground text-sm">All widgets are active</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetCustomizer;
