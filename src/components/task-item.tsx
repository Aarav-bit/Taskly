"use client";

import type { Task } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  // onDeleteTask: (id: string) => void; // Future enhancement
}

export default function TaskItem({ task, onToggleComplete }: TaskItemProps) {
  return (
    <Card className={`transition-all duration-300 ease-in-out ${task.isCompleted ? 'bg-muted/50 opacity-70' : 'bg-card hover:shadow-md'}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.isCompleted}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-labelledby={`task-label-${task.id}`}
        />
        <div className="flex-grow space-y-1">
          <label
            htmlFor={`task-${task.id}`}
            id={`task-label-${task.id}`}
            className={`text-sm font-medium cursor-pointer ${task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}
          >
            {task.text}
          </label>
          {task.deadline && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarClock className="h-3 w-3 mr-1" />
              <span>Deadline: {format(parseISO(task.deadline), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
        {/* Future: Add edit/delete buttons here 
        <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        */}
      </CardContent>
    </Card>
  );
}
