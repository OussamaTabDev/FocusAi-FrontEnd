
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, RefreshCw } from 'lucide-react';

const QuoteWidget: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState({ text: '', author: '' });

  const quotes = [
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "You learn more from failure than from success.", author: "Unknown" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { text: "Productivity is never an accident.", author: "Paul J. Meyer" },
    { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
    { text: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" }
  ];

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem(`daily-quote-${today}`);
    
    if (savedQuote) {
      setCurrentQuote(JSON.parse(savedQuote));
    } else {
      const newQuote = getRandomQuote();
      setCurrentQuote(newQuote);
      localStorage.setItem(`daily-quote-${today}`, JSON.stringify(newQuote));
    }
  }, []);

  const refreshQuote = () => {
    const newQuote = getRandomQuote();
    setCurrentQuote(newQuote);
    const today = new Date().toDateString();
    localStorage.setItem(`daily-quote-${today}`, JSON.stringify(newQuote));
  };

  return (
    <Card className="p-4 h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Quote className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold">Daily Quote</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={refreshQuote}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center space-y-3">
        <blockquote className="text-sm italic text-muted-foreground leading-relaxed">
          "{currentQuote.text}"
        </blockquote>
        <cite className="text-xs font-medium text-primary">
          — {currentQuote.author}
        </cite>
      </div>
    </Card>
  );
};

export default QuoteWidget;
