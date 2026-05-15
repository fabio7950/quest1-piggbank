"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDisplayDate, isValidDateRange, exceedsMaxRange, isDateInFuture, formatUrlDate } from "@/lib/date";
import type { DateRange } from "@/types";
import { url } from "zod/v4/mini";

type DateRangeFilterProps = {
  currentRange: DateRange;
};

export function DateRangeFilter({ currentRange }: DateRangeFilterProps) {
  const router = useRouter();
  const [fromDate, setFromDate] = useState<Date | undefined>(currentRange.from);
  const [toDate, setToDate] = useState<Date | undefined>(currentRange.to);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    if (!fromDate || !toDate) {
      setError("Selecione ambas as datas");
      return;
    }

    const range = { from: fromDate, to: toDate };

    if (!isValidDateRange(range)) {
      setError("Data início deve ser anterior à data fim");
      return;
    }

    if (exceedsMaxRange(range)) {
      setError("Intervalo máximo é de 12 meses");
      return;
    }

    if (isDateInFuture(fromDate) || isDateInFuture(toDate)) {
      setError("Datas futuras não são permitidas");
      return;
    }
  
  
    setIsOpen(false);

    setEror(null);
    router.push(`?from=${formatUrlDate(fromDate as Date)}&to=${formatUrlDate(toDate as Date)}`);




  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {fromDate ? formatDisplayDate(fromDate) : "Data início"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                setFromDate(date);
                setFromOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">até</span>

        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {toDate ? formatDisplayDate(toDate) : "Data fim"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                setToDate(date);
                setToOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button onClick={handleApply} size="sm">
        Aplicar
      </Button>

      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
    </div>
  );
}