
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Monitor, Cpu, HardDrive, Battery } from 'lucide-react';

const SystemStatsWidget: React.FC = () => {
  const [stats, setStats] = useState({
    cpu: 45,
    memory: 62,
    battery: 78,
    storage: 34
  });

  useEffect(() => {
    // Simulate system stats (in a real app, you'd get actual system data)
    const updateStats = () => {
      setStats({
        cpu: Math.floor(Math.random() * 40) + 30, // 30-70%
        memory: Math.floor(Math.random() * 30) + 50, // 50-80%
        battery: Math.floor(Math.random() * 40) + 60, // 60-100%
        storage: Math.floor(Math.random() * 20) + 30 // 30-50%
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, type: string) => {
    if (type === 'battery') {
      if (value < 20) return 'text-red-500';
      if (value < 50) return 'text-yellow-500';
      return 'text-green-500';
    }
    
    if (value > 80) return 'text-red-500';
    if (value > 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Monitor className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">System Stats</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">CPU</span>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(stats.cpu, 'cpu')}`}>
              {stats.cpu}%
            </span>
          </div>
          <Progress value={stats.cpu} className="h-1" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Memory</span>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(stats.memory, 'memory')}`}>
              {stats.memory}%
            </span>
          </div>
          <Progress value={stats.memory} className="h-1" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Battery className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Battery</span>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(stats.battery, 'battery')}`}>
              {stats.battery}%
            </span>
          </div>
          <Progress value={stats.battery} className="h-1" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Storage</span>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(stats.storage, 'storage')}`}>
              {stats.storage}%
            </span>
          </div>
          <Progress value={stats.storage} className="h-1" />
        </div>
      </div>
    </Card>
  );
};

export default SystemStatsWidget;
