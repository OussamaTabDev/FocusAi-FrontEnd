
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Award, Calendar, Plus, X, BookOpen, Coffee, Dumbbell, Brain } from 'lucide-react';
import { ProductivityGoal } from '@/hooks/useProductivitySettings';

interface ProductivityGoalsProps {
  goals: ProductivityGoal[];
  onUpdateGoal: (id: string, current: number) => void;
}

interface PreMadeGoal {
  id: string;
  title: string;
  description: string;
  category: 'productive' | 'focus' | 'break' | 'reading' | 'exercise';
  target: number;
  type: 'daily' | 'weekly';
  icon: React.ReactNode;
}

const ProductivityGoals: React.FC<ProductivityGoalsProps> = ({ goals, onUpdateGoal }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customGoals, setCustomGoals] = useState<ProductivityGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'productive' as const,
    target: 60,
    type: 'daily' as const
  });

  const preMadeGoals: PreMadeGoal[] = [
    {
      id: 'pm1',
      title: 'Deep Work Sessions',
      description: 'Focus on important tasks without distractions',
      category: 'focus',
      target: 120,
      type: 'daily',
      icon: <Brain className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'pm2',
      title: 'Reading Time',
      description: 'Dedicate time to learning and reading',
      category: 'reading',
      target: 30,
      type: 'daily',
      icon: <BookOpen className="h-5 w-5 text-green-500" />
    },
    {
      id: 'pm3',
      title: 'Break Time',
      description: 'Take regular breaks to recharge',
      category: 'break',
      target: 60,
      type: 'daily',
      icon: <Coffee className="h-5 w-5 text-orange-500" />
    },
    {
      id: 'pm4',
      title: 'Exercise',
      description: 'Stay physically active',
      category: 'exercise',
      target: 45,
      type: 'daily',
      icon: <Dumbbell className="h-5 w-5 text-red-500" />
    },
    {
      id: 'pm5',
      title: 'Weekly Focus Goals',
      description: 'Maintain consistent focus throughout the week',
      category: 'focus',
      target: 600,
      type: 'weekly',
      icon: <Target className="h-5 w-5 text-purple-500" />
    }
  ];

  const allGoals = [...goals, ...customGoals];
  const achievedGoals = allGoals.filter(goal => goal.current >= goal.target);
  const unachievedGoals = allGoals.filter(goal => goal.current < goal.target);
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgress = (goal: ProductivityGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'productive': return <Target className="h-5 w-5 text-green-500" />;
      case 'focus': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'break': return <Award className="h-5 w-5 text-purple-500" />;
      case 'reading': return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'exercise': return <Dumbbell className="h-5 w-5 text-red-500" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const addCustomGoal = () => {
    if (!newGoal.title) return;
    
    const customGoal: ProductivityGoal = {
      id: `custom-${Date.now()}`,
      target: newGoal.target,
      current: 0,
      category: newGoal.category,
      type: newGoal.type
    };
    
    setCustomGoals([...customGoals, customGoal]);
    setNewGoal({ title: '', category: 'productive', target: 60, type: 'daily' });
    setIsDialogOpen(false);
  };

  const addPreMadeGoal = (preMadeGoal: PreMadeGoal) => {
    const goal: ProductivityGoal = {
      id: preMadeGoal.id,
      target: preMadeGoal.target,
      current: 0,
      category: preMadeGoal.category,
      type: preMadeGoal.type
    };
    
    setCustomGoals([...customGoals, goal]);
  };

  const removeCustomGoal = (id: string) => {
    setCustomGoals(customGoals.filter(goal => goal.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Productivity Goals</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="custom" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="custom">Custom Goal</TabsTrigger>
                <TabsTrigger value="premade">Pre-made Goals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g., Study Time"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newGoal.category} onValueChange={(value: any) => setNewGoal({...newGoal, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="productive">Productive</SelectItem>
                      <SelectItem value="focus">Focus</SelectItem>
                      <SelectItem value="break">Break</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target (minutes)</Label>
                    <Input
                      id="target"
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newGoal.type} onValueChange={(value: any) => setNewGoal({...newGoal, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={addCustomGoal} className="w-full">
                  Add Custom Goal
                </Button>
              </TabsContent>
              
              <TabsContent value="premade" className="space-y-3">
                {preMadeGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {goal.icon}
                      <div>
                        <div className="font-medium">{goal.title}</div>
                        <div className="text-sm text-muted-foreground">{goal.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {goal.target}min {goal.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addPreMadeGoal(goal)}
                      disabled={allGoals.some(g => g.id === goal.id)}
                    >
                      {allGoals.some(g => g.id === goal.id) ? 'Added' : 'Add'}
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allGoals.map((goal) => (
            <Card key={goal.id} className="p-6 relative">
              {goal.id.startsWith('custom-') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => removeCustomGoal(goal.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getGoalIcon(goal.category)}
                  <span className="font-medium capitalize">{goal.category} Time</span>
                </div>
                <span className="text-xs text-muted-foreground uppercase">
                  {goal.type}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">
                    {formatTime(goal.current)} / {formatTime(goal.target)}
                  </span>
                </div>
                
                <Progress value={getProgress(goal)} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {Math.round(getProgress(goal))}% complete
                  </span>
                  {getProgress(goal) >= 100 && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Award className="h-4 w-4" />
                      <span className="text-xs font-medium">Goal Achieved!</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Unachieved Goals */}
      {unachievedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Target className="h-5 w-5 text-amber-500" />
            <span>Goals In Progress ({unachievedGoals.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unachievedGoals.map((goal) => (
              <Card key={`unachieved-${goal.id}`} className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getGoalIcon(goal.category)}
                    <span className="font-medium capitalize text-sm">{goal.category}</span>
                    <Badge variant="outline" className="text-xs">{goal.type}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(getProgress(goal))}%
                  </span>
                </div>
                <Progress value={getProgress(goal)} className="h-2 mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTime(goal.target - goal.current)} remaining
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Section */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <span>Recent Achievements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl">🎯</div>
            <div>
              <div className="font-medium">Daily Goal Streak</div>
              <div className="text-sm text-muted-foreground">5 days in a row!</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl">⚡</div>
            <div>
              <div className="font-medium">Focus Master</div>
              <div className="text-sm text-muted-foreground">2+ hour focus session</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductivityGoals;
