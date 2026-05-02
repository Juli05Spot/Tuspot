import React from "react";
import {
  Waves, Music, Flame, Thermometer, Car,
  Wifi, Tv, UtensilsCrossed, ShieldCheck, Trees
} from "lucide-react";

const amenityIcons = {
  "Alberca": Waves,
  "Pool": Waves,
  "Piscina": Waves,
  "Sonido": Music,
  "Sound System": Music,
  "Asador": Flame,
  "Grill": Flame,
  "Parrilla": Flame,
  "Refrigeración": Thermometer,
  "A/C": Thermometer,
  "Aire Acondicionado": Thermometer,
  "Estacionamiento": Car,
  "Parking": Car,
  "WiFi": Wifi,
  "Wi-Fi": Wifi,
  "Pantalla": Tv,
  "TV": Tv,
  "Proyector": Tv,
  "Cocina": UtensilsCrossed,
  "Kitchen": UtensilsCrossed,
  "Seguridad": ShieldCheck,
  "Jardín": Trees,
  "Garden": Trees,
};

export default function AmenityList({ amenities }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {amenities.map((amenity) => {
        const Icon = Object.entries(amenityIcons).find(([key]) =>
          amenity.toLowerCase().includes(key.toLowerCase())
        )?.[1] || ShieldCheck;

        return (
          <div
            key={amenity}
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}