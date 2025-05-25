"use client";

import type { Task } from '@/lib/types';
import TaskItem from './task-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export default function TaskList({ tasks, onToggleTask }: TaskListProps) {
  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  if (tasks.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            Your Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No tasks yet. Add some tasks to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <section aria-labelledby="pending-tasks-heading">
          <h3 id="pending-tasks-heading" className="text-lg font-medium text-foreground mb-2">Pending</h3>
          <ul className="space-y-3">
            {pendingTasks.map((task) => (
              <li key={task.id}>
                <TaskItem task={task} onToggleComplete={onToggleTask} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {completedTasks.length > 0 && (
         <section aria-labelledby="completed-tasks-heading">
          <h3 id="completed-tasks-heading" className="text-lg font-medium text-muted-foreground mb-2">Completed</h3>
          <ul className="space-y-3">
            {completedTasks.map((task) => (
              <li key={task.id}>
                <TaskItem task={task} onToggleComplete={onToggleTask} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
