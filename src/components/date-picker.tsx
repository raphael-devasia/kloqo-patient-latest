
"use client";

import { useState } from "react";
import { format, addDays, isSameDay, getDay, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

const weekStartsOn = 1; // Monday

const DatePicker = ({ date, onDateChange }: { date: Date, onDateChange: (date: Date) => void }) => {
  const [currentDate, setCurrentDate] = useState(date);
  
  const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(currentDate, { weekStartsOn }), i));

  return (
    <div className="flex justify-between items-center space-x-2">
      {days.map((day) => (
        <button
          key={day.toString()}
          type="button"
          onClick={() => {
            setCurrentDate(day);
            onDateChange(day);
          }}
          className={cn(
            "flex flex-col items-center justify-center w-12 h-16 rounded-xl space-y-1 transition-colors",
            isSameDay(day, currentDate)
              ? "bg-primary text-primary-foreground"
              : "bg-gray-100 hover:bg-gray-200"
          )}
        >
          <span className="text-xs">{format(day, 'E')}</span>
          <span className="font-bold">{format(day, 'd')}</span>
        </button>
      ))}
    </div>
  );
};

export default DatePicker;
