const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, Users, ArrowLeft, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import PhotoGallery from "../components/venue/PhotoGallery";
import AmenityList from "../components/venue/AmenityList";
import BookingCalendar from "../components/venue/BookingCalendar";
import GuestReviews from "../components/venue/GuestReviews";
import { format } from "date-fns";

const categoryLabels = {
  albercada: "Albercada",
  terraza: "Terraza",
  salon: "Salón",
  quinta: "Quinta",
  jardin: "Jardín",
  rooftop: "Rooftop",
};

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue", id],
    queryFn: async () => {
      const venues = await db.entities.Venue.filter({ id });
      return venues[0];
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ["venue-bookings", id],
    queryFn: () => db.entities.Booking.filter({ venue_id: id }),
    initialData: [],
  });

  const { data: reviews } = useQuery({
    queryKey: ["venue-reviews", id],
    queryFn: () => db.entities.Review.filter({ venue_id: id }),
    initialData: [],
  });

  const bookedDates = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "confirmed" || b.status === "pending")
        .map((b) => b.event_date),
    [bookings]
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-[400px] rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-bold">Espacio no encontrado</p>
        <Button onClick={() => navigate("/explore")} className="mt-4">
          Explorar espacios
        </Button>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    navigate(`/checkout/${venue.id}?date=${dateStr}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-xl">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Gallery */}
      <PhotoGallery images={venue.images} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary font-semibold">
                {categoryLabels[venue.category] || venue.category}
              </Badge>
              {venue.rating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{venue.rating?.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({venue.review_count || reviews.length} reseñas)
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{venue.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {venue.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {venue.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> Hasta {venue.max_capacity} personas
              </span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl font-bold mb-3">Acerca de este espacio</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {venue.description || "Un espacio increíble para todo tipo de eventos. Contacta al anfitrión para más detalles."}
            </p>
          </div>

          <Separator />

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-bold mb-4">Amenidades</h2>
            <AmenityList amenities={venue.amenities} />
          </div>

          {/* Extra services */}
          {venue.extra_services?.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-bold mb-4">Servicios extra</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {venue.extra_services.map((svc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                    >
                      <span className="font-medium text-sm">{svc.name}</span>
                      <span className="font-bold text-primary text-sm">
                        +${svc.price?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Guest Reviews */}
          {reviews.length > 0 && (
            <>
              <Separator />
              <GuestReviews
                reviews={reviews}
                aggregateRating={venue.rating}
                reviewCount={venue.review_count || reviews.length}
              />
            </>
          )}
        </div>

        {/* Right column - Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="border border-border rounded-2xl p-6 bg-card shadow-sm">
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-primary">
                  ${venue.price_per_day?.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-sm"> MXN /día</span>
              </div>
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground mb-1 font-medium">Host: {venue.host_name || "Anfitrión"}</p>
            </div>

            <BookingCalendar
              blockedDates={venue.blocked_dates}
              bookedDates={bookedDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <Button
              onClick={handleBookNow}
              disabled={!selectedDate}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-base"
            >
              {selectedDate ? "¡Quiero este espacio!" : "Selecciona una fecha"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}