
"use client";

import { useState, useRef } from "react";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const DatePicker = ({ date, onDateChange }: { date: Date, onDateChange: (date: Date) => void }) => {
  const [currentDate, setCurrentDate] = useState(date);
  
  const days = Array.from({ length: 30 }).map((_, i) => addDays(startOfToday(), i));

  return (
    <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2">
            {days.map((day) => (
                <button
                key={day.toString()}
                type="button"
                onClick={() => {
                    setCurrentDate(day);
                    onDateChange(day);
                }}
                className={cn(
                    "flex flex-col items-center justify-center w-14 h-16 rounded-xl space-y-1 transition-colors flex-shrink-0",
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
        <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
};

export default DatePicker;
