const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { Plus, Home, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import HostStats from "../components/host/HostStats";
import BookingManager from "../components/host/BookingManager";
import VenueCard from "../components/shared/VenueCard";

export default function HostDashboard() {
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => db.auth.me(),
  });

  const { data: venues, isLoading: loadingVenues } = useQuery({
    queryKey: ["host-venues", user?.email],
    queryFn: () => db.entities.Venue.filter({ host_email: user.email }),
    enabled: !!user?.email,
    initialData: [],
  });

  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ["host-bookings", user?.email],
    queryFn: () => db.entities.Booking.filter({ host_email: user.email }, "-created_date"),
    enabled: !!user?.email,
    initialData: [],
  });

  const isLoading = loadingVenues || loadingBookings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Panel de Host</h1>
          <p className="text-muted-foreground mt-1">Administra tus espacios y reservaciones</p>
        </div>
        <Link to="/host/new">
          <Button className="bg-primary hover:bg-primary/90 font-semibold rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Nuevo Espacio
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <>
          <HostStats venues={venues} bookings={bookings} />

          <Tabs defaultValue="bookings" className="mt-8">
            <TabsList className="bg-secondary rounded-xl">
              <TabsTrigger value="bookings" className="rounded-lg gap-1.5 font-semibold">
                <CalendarDays className="w-4 h-4" /> Reservaciones
              </TabsTrigger>
              <TabsTrigger value="venues" className="rounded-lg gap-1.5 font-semibold">
                <Home className="w-4 h-4" /> Mis Espacios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="mt-6">
              <BookingManager bookings={bookings} hostEmail={user?.email} />
            </TabsContent>

            <TabsContent value="venues" className="mt-6">
              {venues.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold mb-2">No tienes espacios publicados</h3>
                  <p className="text-muted-foreground mb-6">Publica tu primer espacio y empieza a recibir reservaciones</p>
                  <Link to="/host/new">
                    <Button className="bg-primary font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" /> Publicar Espacio
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venues.map((venue, i) => (
                    <VenueCard key={venue.id} venue={venue} index={i} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}