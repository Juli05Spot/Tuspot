import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
      "https://i.ibb.co/tww6ygL1/image.png",
    ],
    latitude: 29.0729,
    longitude: -110.9559,
  },
];

const COMING_SOON = [
  { id: "cs1", emoji: "🎊", label: "Salón de Eventos", hint: "Hermosillo Centro" },
  { id: "cs2", emoji: "🌿", label: "Quinta con Jardín", hint: "Periférico Norte" },
  { id: "cs3", emoji: "🌆", label: "Terraza Rooftop", hint: "Zona Pitic" },
];

export default function TrendingVenues() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Espacios populares</h2>
          <p className="text-muted-foreground mt-1">Los más reservados esta temporada</p>
        </div>
        <Link to="/explore">
          <Button variant="ghost" className="text-primary font-semibold">
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Venues reales */}
        {VENUES_DATA.map((venue, i) => (
          <VenueCard key={venue.id} venue={venue} index={i} />
        ))}

        {/* Placeholders "Próximamente" */}
        {COMING_SOON.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
            className="relative rounded-2xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center p-8 min-h-[300px] gap-4 group"
          >
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
              {item.emoji}
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.hint}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Clock className="w-3 h-3" />
              Próximamente
            </span>
          </motion.div>
        ))}
      </div>

      {/* Banner para atraer hosts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4"
      >
        <p className="text-sm text-muted-foreground">
          ¿Tienes un espacio? <span className="text-foreground font-semibold">Sé el próximo en aparecer aquí.</span>
        </p>
        <Link to="/host/new">
          <Button size="sm" className="shrink-0 font-bold">
            Publicar gratis
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
