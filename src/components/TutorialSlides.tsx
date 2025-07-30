import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { 
  Target, 
  Timer, 
  BarChart3, 
  Settings, 
  Calendar,
  Brain
} from 'lucide-react';

interface TutorialSlidesProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides = [
  {
    icon: <Target className="w-16 h-16 text-primary" />,
    title: "Set Your Goals",
    description: "Define productivity goals and track your progress throughout the day. Stay focused on what matters most."
  },
  {
    icon: <Timer className="w-16 h-16 text-primary" />,
    title: "Pomodoro Timer",
    description: "Use the built-in Pomodoro timer to work in focused intervals with automatic breaks."
  },
  {
    icon: <BarChart3 className="w-16 h-16 text-primary" />,
    title: "Track Progress",
    description: "Monitor your productivity with detailed analytics, reports, and insights about your work patterns."
  },
  {
    icon: <Calendar className="w-16 h-16 text-primary" />,
    title: "Calendar Integration",
    description: "Sync with your calendar to see upcoming events and manage your schedule effectively."
  },
  {
    icon: <Brain className="w-16 h-16 text-primary" />,
    title: "Focus Mode",
    description: "Block distracting websites and apps to maintain deep focus during work sessions."
  },
  {
    icon: <Settings className="w-16 h-16 text-primary" />,
    title: "Customize Everything",
    description: "Personalize your dashboard with widgets, themes, and settings that match your workflow."
  }
];

const TutorialSlides: React.FC<TutorialSlidesProps> = ({ onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Carousel className="w-full">
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className="flex justify-center">
                      {slide.icon}
                    </div>
                    <h2 className="text-3xl font-bold">{slide.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {slide.description}
                    </p>
                    
                    {/* Progress dots */}
                    <div className="flex justify-center space-x-2 py-4">
                      {slides.map((_, dotIndex) => (
                        <div
                          key={dotIndex}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            dotIndex === index ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center pt-4">
                      <Button 
                        variant="ghost" 
                        onClick={onSkip}
                        className="text-muted-foreground"
                      >
                        Skip Tutorial
                      </Button>
                      
                      <div className="flex space-x-2">
                        {index > 0 && (
                          <Button 
                            variant="outline" 
                            onClick={prevSlide}
                          >
                            Previous
                          </Button>
                        )}
                        <Button onClick={nextSlide}>
                          {index === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default TutorialSlides;