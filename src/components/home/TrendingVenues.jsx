import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VenueCard from "../shared/VenueCard";

const VENUES_DATA = [
  {
    id: "1",
    title: "Local de Eventos Atardeceres",
    description: "Hermoso espacio para eventos con alberca, area de asados y cocina equipada. Ideal para albercadas, fiestas y baby showers. Vista al atardecer unica en Hermosillo.",
    location: "Villa Hermosa, Hermosillo, Sonora",
    category: "albercada",
    price_per_day: 8500,
    max_capacity: 100,
    rating: 5.0,
    review_count: 0,
    status: "active",
    amenities: ["Alberca", "Area de asados", "Cocina equipada", "Mesas y sillas", "Manteles", "Estacionamiento", "Area refrigerada"],
    images: [
      "https://i.ibb.co/1fhHwmkZ/image.png",
      "https://i.ibb.co/KxBMVvDb/image.png",
      "https://i.ibb.co/GQQ1YfhQ/image.png",
      "https://i.ibb.co/Rkrgwk1r/image.png",
      "https://i.ibb.co/MybVqG8Y/image.png",
      "https://i.ibb.co/0pZV90bc/image.png",
      "https://i.ibb.co/XrDfNTjs/image.png",
      "https://i.ibb.co/tww6ygL1/image.png"
    ],
    latitude: 29.0729,
    longitude: -110.9559,
  }
];

export default function TrendingVenues() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Espacios populares</h2>
          <p className="text-muted-foreground mt-1">Los mas reservados esta temporada</p>
        </div>
        <Link to="/explore">
          <Button variant="ghost" className="text-primary font-semibold">
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VENUES_DATA.map((venue, i) => (
          <VenueCard key={venue.id} venue={venue} index={i} />
        ))}
      </div>
    </section>
  );
}
