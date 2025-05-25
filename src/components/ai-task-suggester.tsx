"use client";

import { useState } from 'react';
import type { Goal } from '@/lib/types';
import { suggestTasks } from '@/ai/flows/suggest-tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Using Textarea for habits
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AiTaskSuggesterProps {
  goals: Goal[];
  onSuggestions: (suggestions: string[]) => void;
}

export default function AiTaskSuggester({ goals, onSuggestions }: AiTaskSuggesterProps) {
  const [availableTime, setAvailableTime] = useState('');
  const [pastHabits, setPastHabits] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestTasks = async () => {
    if (!goals.length && !availableTime && !pastHabits) {
      toast({
        title: "Input Needed",
        description: "Please provide some goals, available time, or past habits for suggestions.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    onSuggestions([]); // Clear previous suggestions
    try {
      const result = await suggestTasks({
        goals: goals.map(g => g.text).join(', ') || "General productivity",
        availableTime: availableTime || "Any available time",
        pastHabits: pastHabits || "No specific habits provided",
      });
      onSuggestions(result.suggestedTasks);
      if (result.suggestedTasks.length === 0) {
        toast({
          title: "No Suggestions",
          description: "The AI couldn't find any specific suggestions with the current input.",
        });
      }
    } catch (error) {
      console.error("Error fetching task suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-6 w-6 text-accent" />
          AI Task Suggester
        </CardTitle>
        <CardDescription>
          Get task ideas based on your goals, time, and habits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="availableTime" className="text-sm font-medium">Available Time</label>
          <Input
            id="availableTime"
            type="text"
            value={availableTime}
            onChange={(e) => setAvailableTime(e.target.value)}
            placeholder="e.g., 2 hours, this evening"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="pastHabits" className="text-sm font-medium">Past Habits / Preferences</label>
          <Textarea
            id="pastHabits"
            value={pastHabits}
            onChange={(e) => setPastHabits(e.target.value)}
            placeholder="e.g., prefer morning tasks, enjoy coding challenges"
            disabled={isLoading}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSuggestTasks} disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="animate-pulse">Getting Suggestions...</span>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" /> Suggest Tasks
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
