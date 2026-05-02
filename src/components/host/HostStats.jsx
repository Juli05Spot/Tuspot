import React from "react";
import { DollarSign, CalendarDays, Home, TrendingUp } from "lucide-react";

export default function HostStats({ venues, bookings }) {
  const totalEarnings = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "completed").length;

  const stats = [
    { label: "Espacios Publicados", value: venues.length, icon: Home, color: "bg-blue-500/10 text-blue-600" },
    { label: "Reservas Pendientes", value: pendingBookings, icon: CalendarDays, color: "bg-yellow-500/10 text-yellow-600" },
    { label: "Reservas Confirmadas", value: confirmedBookings, icon: TrendingUp, color: "bg-green-500/10 text-green-600" },
    { label: "Ganancias Totales", value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="border border-border rounded-2xl p-5 bg-card">
          <div className={`p-2.5 rounded-xl w-fit mb-3 ${stat.color}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}