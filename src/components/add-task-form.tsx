"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  onAddTask: (text: string, deadline?: string) => void;
}

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim(), deadline ? format(deadline, "yyyy-MM-dd") : undefined);
      setTaskText('');
      setDeadline(undefined);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PlusCircle className="h-6 w-6 text-primary" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="taskText" className="text-sm font-medium">Task Description</label>
            <Input
              id="taskText"
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="What do you need to do?"
              required
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="taskDeadline" className="text-sm font-medium">Deadline (Optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button type="submit" className="w-full sm:w-auto">
            Add Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
