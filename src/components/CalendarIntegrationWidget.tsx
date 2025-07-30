
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'task' | 'reminder';
}

const CalendarIntegrationWidget = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Standup',
      start: new Date(2025, 5, 24, 9, 0),
      end: new Date(2025, 5, 24, 9, 30),
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Code Review',
      start: new Date(2025, 5, 24, 14, 0),
      end: new Date(2025, 5, 24, 15, 0),
      type: 'task'
    }
  ]);

  const todayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'task': return 'bg-green-100 text-green-800 border-green-200';
      case 'reminder': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Today's Schedule</h3>
        </div>
        <Button variant="ghost" size="sm">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {todayEvents.length > 0 ? (
          todayEvents.map((event) => (
            <div key={event.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events today</p>
          </div>
        )}
      </div>

      <Button variant="outline" size="sm" className="w-full mt-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Event
      </Button>
    </Card>
  );
};

export default CalendarIntegrationWidget;
