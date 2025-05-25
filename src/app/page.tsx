"use client";

import { useState, useEffect } from "react";
import type { Task, Goal } from "@/lib/types";
import { AppLayout } from "@/components/layout/app-layout";
import DateTimeDisplay from "@/components/date-time-display";
import GoalManager from "@/components/goal-manager";
import TaskList from "@/components/task-list";
import AddTaskForm from "@/components/add-task-form";
import AiTaskSuggester from "@/components/ai-task-suggester";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [suggestedAiTasks, setSuggestedAiTasks] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Load from localStorage
    const storedTasks = localStorage.getItem('momentumAiTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    const storedGoals = localStorage.getItem('momentumAiGoals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('momentumAiTasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('momentumAiGoals', JSON.stringify(goals));
    }
  }, [goals, isClient]);


  const handleAddTask = (text: string, deadline?: string) => {
    const newTask: Task = { id: uuidv4(), text, deadline, isCompleted: false };
    setTasks(prev => [newTask, ...prev]); // Add to beginning
    toast({ title: "Task Added", description: `"${text}" has been added to your list.`});
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => {
      const updatedTasks = prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t);
      const task = updatedTasks.find(t => t.id === taskId);
      if (task) {
        toast({
          title: task.isCompleted ? "Task Completed!" : "Task Marked Pending",
          description: `"${task.text}" status updated.`
        });
      }
      return updatedTasks;
    });
  };

  const handleAddGoal = (text: string) => {
    const newGoal: Goal = { id: uuidv4(), text };
    setGoals(prev => [newGoal, ...prev]);
    toast({ title: "Goal Set", description: `New goal "${text}" added.`});
  };

  const handleDeleteGoal = (goalId: string) => {
    const goalToDelete = goals.find(g => g.id === goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    if (goalToDelete) {
       toast({ title: "Goal Removed", description: `Goal "${goalToDelete.text}" removed.`, variant: "destructive"});
    }
  };

  const handleAddSuggestedTask = (suggestionText: string) => {
    handleAddTask(suggestionText); // Re-use existing add task logic
    setSuggestedAiTasks(prev => prev.filter(s => s !== suggestionText)); // Remove from suggestions
    toast({ title: "Task Added from Suggestion", description: `"${suggestionText}" added.`});
  }

  if (!isClient) {
    // To prevent hydration mismatch with localStorage, render null or a loader on first pass
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AppLayout
      sidebarContent={
        <GoalManager goals={goals} onAddGoal={handleAddGoal} onDeleteGoal={handleDeleteGoal} />
      }
    >
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Task Dashboard</h1>
            <p className="text-muted-foreground">Organize your day, achieve your goals.</p>
          </div>
          <DateTimeDisplay />
        </header>

        <section aria-labelledby="add-task-heading">
          <h2 id="add-task-heading" className="sr-only">Add New Task</h2>
          <AddTaskForm onAddTask={handleAddTask} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section aria-labelledby="tasks-heading" className="lg:col-span-2 space-y-4">
             {/* TaskList will render its own title if needed, or we add one here */}
            <TaskList tasks={tasks} onToggleTask={handleToggleTask} />
          </section>

          <aside aria-labelledby="ai-suggestions-heading" className="space-y-6">
            <AiTaskSuggester goals={goals} onSuggestions={setSuggestedAiTasks} />
            
            {suggestedAiTasks.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">AI Suggested Tasks</CardTitle>
                  <CardDescription>Quickly add these to your list.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestedAiTasks.map((suggestion, index) => (
                      <li key={index} className="flex items-center justify-between gap-2 p-3 bg-accent/10 rounded-lg border border-accent/30">
                        <span className="text-sm flex-1">{suggestion}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddSuggestedTask(suggestion)}
                          aria-label={`Add suggested task: ${suggestion}`}
                        >
                          <PlusCircle className="h-4 w-4 mr-1.5" /> Add
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
