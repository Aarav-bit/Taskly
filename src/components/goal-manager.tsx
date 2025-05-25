"use client";

import type { Goal } from '@/lib/types';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Target } from 'lucide-react';

interface GoalManagerProps {
  goals: Goal[];
  onAddGoal: (text: string) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalManager({ goals, onAddGoal, onDeleteGoal }: GoalManagerProps) {
  const [newGoalText, setNewGoalText] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalText.trim()) {
      onAddGoal(newGoalText.trim());
      setNewGoalText('');
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center gap-2 text-lg font-semibold text-foreground mb-2">
        <Target className="h-6 w-6 text-primary" />
        <span>Your Goals</span>
      </div>
      
      <form onSubmit={handleAddGoal} className="flex gap-2">
        <Input
          type="text"
          value={newGoalText}
          onChange={(e) => setNewGoalText(e.target.value)}
          placeholder="Set a new goal"
          className="flex-grow"
        />
        <Button type="submit" size="icon" aria-label="Add goal">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </form>

      {goals.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No goals set yet. Add a goal to get started!</p>
      ) : (
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li key={goal.id}>
              <Card className="bg-card/50">
                <CardContent className="p-3 flex justify-between items-center">
                  <span className="text-sm flex-grow">{goal.text}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteGoal(goal.id)}
                    aria-label={`Delete goal: ${goal.text}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
