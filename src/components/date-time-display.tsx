"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';

export default function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(timer); // Cleanup the interval on component unmount
    };
  }, []);

  return (
    <Card className="shadow-md">
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span>{format(currentDateTime, 'EEEE, MMMM do, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Clock className="h-5 w-5 text-primary" />
          <span>{format(currentDateTime, 'h:mm:ss a')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
