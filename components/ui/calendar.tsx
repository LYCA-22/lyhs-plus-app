"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 relative", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 w-full",
        month: "space-y-4 w-full",
        weeks: "w-full",
        month_caption:
          "flex justify-center pt-1 relative items-center absolute mx-10",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center ",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_previous:
          "absolute hover:bg-buttonBg left-3 top-3 rounded-full border flex items-center justify-center p-2",
        button_next:
          "absolute hover:bg-buttonBg right-3 top-3 rounded-full border flex items-center justify-center p-2",
        month_grid: "w-full border-collapse space-y-1",
        weekdays:
          "border-b text-muted-foreground w-full rounded-md font-normal text-[0.8rem]",
        weekday: "pb-1",
        row: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-transparent [&:has([aria-selected])]:hover:text-white",
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "bg-primary rounded-md text-primary-foreground hover:bg-buttonBg",
        today: "dark:bg-accent text-primary",
        outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeft size={18} className="h-2 w-2" {...props} />;
          }
          return <ChevronRight size={18} className="h-2 w-2" {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
