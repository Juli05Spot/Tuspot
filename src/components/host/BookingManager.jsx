const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, X, Clock, CalendarDays, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  confirmed: { label: "Confirmada", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  declined: { label: "Rechazada", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  cancelled: { label: "Cancelada", color: "bg-muted text-muted-foreground border-border" },
  completed: { label: "Completada", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

export default function BookingManager({ bookings, hostEmail }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateBooking = useMutation({
    mutationFn: ({ id, data }) => db.entities.Booking.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["host-bookings"] });
      toast({ title: "Reservación actualizada" });
    },
  });

  const handleAction = (booking, newStatus) => {
    updateBooking.mutate({ id: booking.id, data: { status: newStatus } });
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">No hay reservaciones aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const status = statusConfig[booking.status] || statusConfig.pending;
        return (
          <div key={booking.id} className="border border-border rounded-2xl p-5 bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold line-clamp-1">{booking.venue_title}</h3>
                  <Badge className={`${status.color} border shrink-0`}>{status.label}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {booking.guest_name || booking.guest_email}
                  </span>
                  {booking.event_date && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {format(new Date(booking.event_date + "T12:00:00"), "dd/MM/yyyy")}
                    </span>
                  )}
                  <span className="font-bold text-primary">${booking.total_price?.toLocaleString()}</span>
                </div>
                {booking.notes && (
                  <div className="flex items-start gap-1.5 mt-2 text-sm text-muted-foreground">
                    <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{booking.notes}</span>
                  </div>
                )}
              </div>

              {booking.status === "pending" && (
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleAction(booking, "confirmed")}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl gap-1"
                  >
                    <Check className="w-4 h-4" /> Aceptar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(booking, "declined")}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 font-semibold rounded-xl gap-1"
                  >
                    <X className="w-4 h-4" /> Rechazar
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}