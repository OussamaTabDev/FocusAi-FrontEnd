import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Snowflake, Wind, MapPin } from 'lucide-react';
import WidgetSettingsPanel, { WidgetSettingsOption } from '@/components/WidgetSettingsPanel';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState({
    temp: 22,
    condition: 'sunny',
    location: 'Your Location',
    humidity: 65
  });
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [location, setLocation] = useState('Your Location');
  const [showHumidity, setShowHumidity] = useState(true);

  // Simulate weather data (in a real app, you'd fetch from an API)
  useEffect(() => {
    const refreshWeather = () => {
      const conditions = ['sunny', 'cloudy', 'rainy', 'windy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
      
      setWeather({
        temp: randomTemp,
        condition: randomCondition,
        location: location,
        humidity: Math.floor(Math.random() * 40) + 40 // 40-80%
      });
    };

    refreshWeather();
    
    if (autoRefresh) {
      const interval = setInterval(refreshWeather, 300000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'windy': return <Wind className="h-8 w-8 text-gray-600" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const convertTemp = (temp: number) => {
    if (unit === 'F') {
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  const refreshWeather = () => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'windy'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 30) + 5;
    
    setWeather({
      temp: randomTemp,
      condition: randomCondition,
      location: location,
      humidity: Math.floor(Math.random() * 40) + 40
    });
  };

  const customOptions: WidgetSettingsOption[] = [
    {
      type: 'input',
      key: 'location',
      label: 'Location',
      value: location,
      onChange: setLocation,
      description: 'Enter your city or location'
    },
    {
      type: 'switch',
      key: 'unit',
      label: 'Fahrenheit',
      value: unit === 'F',
      onChange: (value: boolean) => setUnit(value ? 'F' : 'C'),
      description: 'Use Fahrenheit instead of Celsius'
    },
    {
      type: 'switch',
      key: 'auto-refresh',
      label: 'Auto Refresh',
      value: autoRefresh,
      onChange: setAutoRefresh,
      description: 'Automatically update weather every 5 minutes'
    },
    {
      type: 'switch',
      key: 'show-humidity',
      label: 'Show Humidity',
      value: showHumidity,
      onChange: setShowHumidity,
      description: 'Display humidity information'
    }
  ];

  return (
    <Card className="p-4 h-full flex flex-col justify-center relative">
      <WidgetSettingsPanel
        widgetTitle="Weather"
        customOptions={customOptions}
        onRefresh={refreshWeather}
        onDelete={() => console.log('Delete widget')}
      />
      
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          {getWeatherIcon(weather.condition)}
        </div>
        
        <div>
          <div className="text-3xl font-bold text-primary">
            {convertTemp(weather.temp)}°{unit}
          </div>
          <div className="text-sm text-muted-foreground capitalize">{weather.condition}</div>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{weather.location}</span>
          </div>
          {showHumidity && <div>Humidity: {weather.humidity}%</div>}
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
