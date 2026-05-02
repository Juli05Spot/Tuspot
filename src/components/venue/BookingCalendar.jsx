import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { startOfDay, format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarCheck, CircleDot, Ban } from "lucide-react";

export default function BookingCalendar({ blockedDates = [], bookedDates = [], selectedDate, onSelectDate }) {
  const today = startOfDay(new Date());

  const blockedParsed = (blockedDates || []).map((d) => startOfDay(new Date(d)));
  const bookedParsed = (bookedDates || []).map((d) => startOfDay(new Date(d)));

  const disabledDays = [
    { before: today },
    ...blockedParsed,
    ...bookedParsed,
  ];

  const isBooked = (day) => bookedParsed.some((d) => isSameDay(d, day));
  const isBlocked = (day) => blockedParsed.some((d) => isSameDay(d, day));

  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-base">Disponibilidad</h3>
      </div>

      {/* Calendar */}
      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={disabledDays}
          locale={es}
          showOutsideDays={false}
          classNames={{
            months: "w-full",
            month: "w-full space-y-3",
            caption: "flex justify-center items-center pt-1 relative mb-2",
            caption_label: "text-sm font-bold capitalize",
            nav: "flex items-center",
            nav_button:
              "h-7 w-7 bg-transparent hover:bg-secondary rounded-lg flex items-center justify-center transition-colors",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell:
              "text-muted-foreground rounded-md flex-1 font-semibold text-[11px] uppercase text-center",
            row: "flex w-full mt-1",
            cell: "flex-1 text-center text-sm relative p-0 focus-within:relative focus-within:z-20",
            day: "h-9 w-full rounded-lg mx-auto flex items-center justify-center text-sm font-medium transition-all hover:bg-secondary cursor-pointer",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-md shadow-primary/30 scale-105",
            day_today:
              "border border-primary/40 text-primary font-bold",
            day_outside: "opacity-0 pointer-events-none",
            day_disabled:
              "opacity-30 cursor-not-allowed line-through hover:bg-transparent",
          }}
          components={{
            DayContent: ({ date }) => {
              const booked = isBooked(date);
              const blocked = isBlocked(date);
              return (
                <span className="relative flex items-center justify-center w-full h-full">
                  {date.getDate()}
                  {booked && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                  )}
                  {blocked && !booked && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-muted-foreground/40" />
                  )}
                </span>
              );
            },
          }}
        />
      </div>

      {/* Legend */}
      <div className="px-5 pb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
          Reservado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-muted-foreground/40 inline-block" />
          Bloqueado
        </span>
      </div>

      {/* Selected date confirmation */}
      {selectedDate && (
        <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
          <CalendarCheck className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-xs text-primary/70 font-semibold uppercase tracking-wide">Fecha seleccionada</p>
            <p className="text-sm font-bold text-primary capitalize">
              {format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}