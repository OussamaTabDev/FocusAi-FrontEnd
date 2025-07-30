import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Camera, Clock, Calendar, LayoutGrid, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format, addDays, subDays, isBefore, isAfter, isToday } from 'date-fns';

const Timeline = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Mock data - only for June 24, 2025
  const mockDataDate = new Date(2025, 5, 24); // June 24, 2025
  const hasDataForDate = selectedDate.toDateString() === mockDataDate.toDateString();
  
  const timelineData = hasDataForDate ? [
    { time: '09:00', duration: '2h 15m', app: 'Visual Studio Code', category: 'productive', screenshot: true },
    { time: '11:15', duration: '30m', app: 'Slack', category: 'neutral', screenshot: false },
    { time: '11:45', duration: '1h 30m', app: 'Figma', category: 'productive', screenshot: true },
    { time: '13:15', duration: '45m', app: 'Lunch Break', category: 'neutral', screenshot: false },
    { time: '14:00', duration: '1h 30m', app: 'Visual Studio Code', category: 'productive', screenshot: true },
    { time: '15:30', duration: '20m', app: 'YouTube', category: 'distracting', screenshot: true },
    { time: '15:50', duration: '2h 10m', app: 'Figma', category: 'productive', screenshot: true },
  ] : [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productive':
        return 'bg-emerald-500';
      case 'neutral':
        return 'bg-amber-500';
      case 'distracting':
        return 'bg-rose-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'productive':
        return 'from-emerald-500/20 to-emerald-500/5 border-emerald-200 dark:border-emerald-800';
      case 'neutral':
        return 'from-amber-500/20 to-amber-500/5 border-amber-200 dark:border-amber-800';
      case 'distracting':
        return 'from-rose-500/20 to-rose-500/5 border-rose-200 dark:border-rose-800';
      default:
        return 'from-slate-500/20 to-slate-500/5 border-slate-200 dark:border-slate-800';
    }
  };

  const getDurationMinutes = (duration: string) => {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)m/);
    return (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
  };

  const getEmptyStateMessage = () => {
    const today = new Date();
    
    if (isBefore(selectedDate, today) && !isToday(selectedDate)) {
      return {
        icon: <Clock className="h-12 w-12 text-muted-foreground/40" />,
        title: "No Activity Recorded",
        message: "No monitoring data was recorded for this past date. Activity tracking might not have been enabled."
      };
    } else if (isAfter(selectedDate, today)) {
      return {
        icon: <CalendarDays className="h-12 w-12 text-muted-foreground/40" />,
        title: "Future Date",
        message: "This date is in the future. Start monitoring to see your activity data here."
      };
    } else {
      return {
        icon: <Clock className="h-12 w-12 text-muted-foreground/40" />,
        title: "No Activity Today",
        message: "No activity has been recorded yet today. Make sure monitoring is enabled to track your productivity."
      };
    }
  };

  const EmptyState = () => {
    const emptyState = getEmptyStateMessage();
    
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-0 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          {emptyState.icon}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{emptyState.title}</h3>
            <p className="text-muted-foreground max-w-md">{emptyState.message}</p>
          </div>
        </div>
      </Card>
    );
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1));
  };

  // Calendar-Style Timeline
  const CalendarTimeline = () => {
    if (!hasDataForDate) return <EmptyState />;
    
    const hours = Array.from({ length: 12 }, (_, i) => i + 9); // 9 AM to 8 PM
    
    return (
      <Card className="p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-0 shadow-xl">
        <div className="grid grid-cols-12 gap-4">
          {/* Time Column */}
          <div className="col-span-2 space-y-6">
            <div className="h-12 flex items-center">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Time</span>
            </div>
            {hours.map(hour => (
              <div key={hour} className="h-20 flex items-center">
                <div className="text-right w-full">
                  <div className="text-lg font-bold text-foreground">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {hour < 12 ? 'AM' : 'PM'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Activity Column */}
          <div className="col-span-10 space-y-6">
            <div className="h-12 flex items-center border-b border-border/50">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Activities</span>
            </div>
            {hours.map(hour => {
              const hourStr = `${hour.toString().padStart(2, '0')}:00`;
              const activitiesInHour = timelineData.filter(item => {
                const itemHour = parseInt(item.time.split(':')[0]);
                return itemHour === hour;
              });
              
              return (
                <div key={hour} className="h-20 flex items-center">
                  {activitiesInHour.length > 0 ? (
                    <div className="w-full space-y-2">
                      {activitiesInHour.map((item, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-xl bg-gradient-to-r ${getCategoryGradient(item.category)} border-l-4 ${getCategoryColor(item.category).replace('bg-', 'border-')} transition-all hover:shadow-lg hover:scale-[1.02]`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 ${getCategoryColor(item.category)} rounded-full shadow-sm`}></div>
                              <div>
                                <div className="font-semibold text-foreground">{item.app}</div>
                                <div className="text-sm text-muted-foreground flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{item.time} • {item.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.screenshot && (
                                <div className="p-1.5 bg-background/50 rounded-lg">
                                  <Camera className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                item.category === 'productive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                item.category === 'neutral' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                              }`}>
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border/30 rounded-xl">
                      <span className="text-sm text-muted-foreground/60 italic">No activity</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    );
  };

  // Modern Card Timeline
  const ModernCardTimeline = () => {
    if (!hasDataForDate) return <EmptyState />;
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {timelineData.map((item, index) => {
          const duration = getDurationMinutes(item.duration);
          const width = Math.max((duration / 180) * 100, 20); // Scale based on 3 hours max
          
          return (
            <Card 
              key={index} 
              className={`group relative overflow-hidden bg-gradient-to-br ${getCategoryGradient(item.category)} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${getCategoryColor(item.category)} rounded-full shadow-lg`}></div>
                    <span className="text-2xl font-mono font-bold text-foreground">{item.time}</span>
                  </div>
                  {item.screenshot && (
                    <div className="p-2 bg-background/70 backdrop-blur-sm rounded-lg shadow-sm">
                      <Camera className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* App Name */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-1">{item.app}</h3>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{item.duration}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-background/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${getCategoryColor(item.category)} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Activity duration visualization
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="flex justify-end">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                    item.category === 'productive' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' :
                    item.category === 'neutral' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200'
                  }`}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-black/5 to-transparent rounded-tr-3xl"></div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Timeline
          </h2>
          <p className="text-muted-foreground mt-1">Track your daily activities and productivity</p>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-accent/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="px-4 py-2 text-sm font-medium text-foreground min-w-[200px] text-center">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
            className="text-xs"
          >
            Today
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="calendar" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Calendar View</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutGrid className="h-4 w-4" />
            <span className="font-medium">Card View</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-8">
          <CalendarTimeline />
        </TabsContent>

        <TabsContent value="cards" className="mt-8">
          <ModernCardTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timeline;
