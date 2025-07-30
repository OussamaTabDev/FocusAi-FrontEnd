
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, Volume2, SkipForward } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  category: 'rain' | 'nature' | 'white-noise' | 'instrumental';
  duration: string;
}

const FocusMusicWidget = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks: Track[] = [
    { id: '1', name: 'Rain Forest', category: 'rain', duration: '∞' },
    { id: '2', name: 'Ocean Waves', category: 'nature', duration: '∞' },
    { id: '3', name: 'White Noise', category: 'white-noise', duration: '∞' },
    { id: '4', name: 'Lo-fi Beats', category: 'instrumental', duration: '∞' }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rain': return 'bg-blue-100 text-blue-700';
      case 'nature': return 'bg-green-100 text-green-700';
      case 'white-noise': return 'bg-gray-100 text-gray-700';
      case 'instrumental': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Music className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Focus Music</h3>
      </div>

      <div className="space-y-4">
        {/* Current Track */}
        <div className="text-center p-4 bg-accent/50 rounded-lg">
          <h4 className="font-medium">{tracks[currentTrack].name}</h4>
          <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${getCategoryColor(tracks[currentTrack].category)}`}>
            {tracks[currentTrack].category}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button variant="outline" size="sm" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4" />
            <span className="text-sm">Volume</span>
          </div>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Track List */}
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrack(index)}
              className={`w-full text-left p-2 rounded hover:bg-accent/50 transition-colors ${
                index === currentTrack ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{track.name}</span>
                <span className="text-xs text-muted-foreground">{track.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FocusMusicWidget;
