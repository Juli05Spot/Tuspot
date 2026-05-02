const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Check, CalendarDays, Users, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

export default function Checkout() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const dateStr = urlParams.get("date");
  const eventDate = dateStr ? new Date(dateStr + "T12:00:00") : null;

  const [step, setStep] = useState(1);
  const [guestCount, setGuestCount] = useState("");
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedExtras, setSelectedExtras] = useState([]);

  const { data: venue, isLoading } = useQuery({
    queryKey: ["venue", venueId],
    queryFn: async () => {
      const venues = await db.entities.Venue.filter({ id: venueId });
      return venues[0];
    },
  });

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => db.auth.me(),
  });

  const createBooking = useMutation({
    mutationFn: (data) => db.entities.Booking.create(data),
    onSuccess: () => {
      toast({ title: "¡Reservación enviada!", description: "El anfitrión revisará tu solicitud." });
      navigate("/my-bookings");
    },
  });

  if (isLoading || !venue) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const extrasTotal = selectedExtras.reduce((sum, ext) => sum + ext.price, 0);
  const totalPrice = (venue.price_per_day || 0) + extrasTotal;

  const toggleExtra = (svc) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.name === svc.name)
        ? prev.filter((e) => e.name !== svc.name)
        : [...prev, svc]
    );
  };

  const handleConfirm = () => {
    createBooking.mutate({
      venue_id: venue.id,
      venue_title: venue.title,
      venue_image: venue.images?.[0] || "",
      guest_email: user?.email,
      guest_name: guestName || user?.full_name || "",
      host_email: venue.host_email,
      event_date: dateStr,
      guest_count: parseInt(guestCount) || 0,
      extras: selectedExtras,
      base_price: venue.price_per_day,
      extras_total: extrasTotal,
      total_price: totalPrice,
      status: "pending",
      notes,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Button>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {["Detalles", "Extras", "Confirmar"].map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-2 ${step > i + 1 ? "text-primary" : step === i + 1 ? "text-foreground" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > i + 1
                    ? "bg-primary text-primary-foreground"
                    : step === i + 1
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-sm font-semibold hidden sm:block">{label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? "bg-primary" : "bg-border"}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold">Detalles del evento</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Nombre completo</label>
                  <Input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={user?.full_name || "Tu nombre"}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Número de invitados</label>
                  <Input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder={`Máximo ${venue.max_capacity}`}
                    max={venue.max_capacity}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1.5 block">Notas especiales (opcional)</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alguna solicitud especial..."
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full h-11 rounded-xl bg-primary font-bold">
                Elegir mis extras →
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold">Servicios extra</h2>
              {venue.extra_services?.length > 0 ? (
                <div className="space-y-3">
                  {venue.extra_services.map((svc, i) => {
                    const isSelected = selectedExtras.find((e) => e.name === svc.name);
                    return (
                      <label
                        key={i}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={!!isSelected}
                            onCheckedChange={() => toggleExtra(svc)}
                          />
                          <span className="font-medium">{svc.name}</span>
                        </div>
                        <span className="font-bold text-primary">+${svc.price?.toLocaleString()}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground py-8 text-center">No hay servicios extra disponibles</p>
              )}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl font-bold">
                  Atrás
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 h-11 rounded-xl bg-primary font-bold">
                  Ver resumen de mi reserva
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold">Confirmar reservación</h2>
              <div className="p-6 rounded-2xl bg-secondary/50 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Espacio base</span>
                  <span className="font-semibold">${venue.price_per_day?.toLocaleString()}</span>
                </div>
                {selectedExtras.map((ext, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{ext.name}</span>
                    <span className="font-semibold">+${ext.price?.toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-extrabold text-lg text-primary">${totalPrice.toLocaleString()} MXN</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl font-bold">
                  Atrás
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={createBooking.isPending}
                  className="flex-1 h-11 rounded-xl bg-primary font-bold"
                >
                  {createBooking.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  ¡Reservar ahora!
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 border border-border rounded-2xl p-5 bg-card shadow-sm">
            <div className="flex gap-3 mb-4">
              <img
                src={venue.images?.[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=150&fit=crop"}
                alt={venue.title}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-bold text-sm line-clamp-1">{venue.title}</h3>
                <p className="text-xs text-muted-foreground">{venue.location}</p>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-3 text-sm">
              {eventDate && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span>{format(eventDate, "dd 'de' MMMM, yyyy")}</span>
                </div>
              )}
              {guestCount && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{guestCount} invitados</span>
                </div>
              )}
              {venue.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{venue.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}