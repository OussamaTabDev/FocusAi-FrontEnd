
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, Plus, Clock, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  timeSpent: number; // in minutes
  priority: 'low' | 'medium' | 'high';
}

const TaskManagementWidget = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review code changes', completed: false, timeSpent: 45, priority: 'high' },
    { id: '2', title: 'Update documentation', completed: true, timeSpent: 30, priority: 'medium' },
    { id: '3', title: 'Team meeting prep', completed: false, timeSpent: 15, priority: 'low' }
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        timeSpent: 0,
        priority: 'medium'
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Card className="p-4 h-full">
      <div className="flex items-center space-x-2 mb-4">
        <CheckSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Tasks</h3>
      </div>

      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <Button onClick={addTask} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {tasks.map((task) => (
          <div key={task.id} className={`p-3 border-l-4 border rounded-lg hover:bg-accent/50 transition-colors ${getPriorityColor(task.priority)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.timeSpent}m</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        {tasks.filter(t => !t.completed).length} pending • {tasks.filter(t => t.completed).length} completed
      </div>
    </Card>
  );
};

export default TaskManagementWidget;
