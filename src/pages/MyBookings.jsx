const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
  confirmed: { label: "Confirmada", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
  declined: { label: "Rechazada", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
  cancelled: { label: "Cancelada", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
  completed: { label: "Completada", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle2 },
};

export default function MyBookings() {
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => db.auth.me(),
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.email],
    queryFn: () => db.entities.Booking.filter({ guest_email: user.email }, "-created_date"),
    enabled: !!user?.email,
    initialData: [],
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold mb-2">Mis Reservas</h1>
      <p className="text-muted-foreground mb-8">Historial y estado de tus reservaciones</p>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">No tienes reservas aún</h3>
          <p className="text-muted-foreground mb-6">Explora espacios increíbles y haz tu primera reservación</p>
          <Link to="/explore">
            <Button className="bg-primary font-semibold rounded-xl">Explorar Espacios</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <div key={booking.id} className="border border-border rounded-2xl p-5 bg-card hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={booking.venue_image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=150&fit=crop"}
                    alt={booking.venue_title}
                    className="w-full sm:w-28 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link to={`/venue/${booking.venue_id}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                        {booking.venue_title}
                      </Link>
                      <Badge className={`${status.color} border shrink-0 flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {booking.event_date && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {format(new Date(booking.event_date + "T12:00:00"), "dd 'de' MMMM, yyyy")}
                        </span>
                      )}
                      <span className="font-bold text-primary">
                        ${booking.total_price?.toLocaleString()} MXN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}