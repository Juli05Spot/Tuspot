import React from "react";
import { Link } from "react-router-dom";
import { Star, Users, MapPin, CalendarCheck, Camera, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const categoryLabels = {
  albercada: "Albercada",
  terraza: "Terraza",
  salon: "Salón",
  quinta: "Quinta",
  jardin: "Jardín",
  rooftop: "Rooftop",
};

const placeholderImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
];

function getDynamicTag(venue, index) {
  if (venue.review_count >= 10) return { label: "Más reservado", color: "#7C3AED", bg: "rgba(124,58,237,0.15)" };
  if (venue.rating >= 4.7) return { label: "Mejor valorado", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" };
  if (venue.category === "albercada" || venue.category === "salon") return { label: "Ideal para fiestas", color: "#10B981", bg: "rgba(16,185,129,0.15)" };
  if (index % 4 === 3) return { label: "Últimas fechas disponibles", color: "#EF4444", bg: "rgba(239,68,68,0.15)" };
  return null;
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-3.5 h-3.5"
          style={{
            fill: s <= Math.round(rating) ? "#F26B3C" : "transparent",
            color: s <= Math.round(rating) ? "#F26B3C" : "rgba(255,255,255,0.2)",
          }}
        />
      ))}
    </div>
  );
}

export default function VenueCard({ venue, index = 0 }) {
  const mainImage = venue.images?.[0] || placeholderImages[index % placeholderImages.length];
  const photoCount = venue.images?.length || 0;
  const dynamicTag = getDynamicTag(venue, index);
  const previewAmenities = venue.amenities?.slice(0, 3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group"
    >
      <Link to={`/venue/${venue.id}`} className="block h-full">
        <div
          className="relative flex flex-col h-full rounded-2xl overflow-hidden border transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-xl group-hover:-translate-y-1"
          style={{ backgroundColor: "#1a1a1a", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden shrink-0">
            <img
              src={mainImage}
              alt={venue.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Category pill — top left */}
            <div className="absolute top-3 left-3">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.9)" }}
              >
                {categoryLabels[venue.category] || venue.category}
              </span>
            </div>

            {/* Dynamic tag — top right */}
            {dynamicTag && (
              <div className="absolute top-3 right-3">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm whitespace-nowrap"
                  style={{ backgroundColor: dynamicTag.bg, color: dynamicTag.color, border: `1px solid ${dynamicTag.color}40` }}
                >
                  {dynamicTag.label}
                </span>
              </div>
            )}

            {/* Price — bottom right */}
            <div className="absolute bottom-3 right-3">
              <span
                className="inline-flex items-baseline gap-0.5 px-3 py-1.5 rounded-xl font-extrabold text-base backdrop-blur-sm"
                style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#F26B3C" }}
              >
                ${venue.price_per_day?.toLocaleString()}
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>/día</span>
              </span>
            </div>

            {/* ✨ NUEVO: Contador de fotos — bottom left */}
            {photoCount > 1 && (
              <div className="absolute bottom-3 left-3">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.75)" }}
                >
                  <Camera className="w-3 h-3" />
                  {photoCount} fotos
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 gap-3">
            {/* Title */}
            <h3
              className="font-bold text-base leading-snug line-clamp-1 transition-colors duration-200 group-hover:text-primary"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              {venue.title}
            </h3>

            {/* Location */}
            {venue.location && (
              <div className="flex items-center gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{venue.location}</span>
              </div>
            )}

            {/* Rating + capacity */}
            <div className="flex items-center justify-between">
              {venue.rating > 0 ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={venue.rating} />
                  <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {venue.rating.toFixed(1)}
                  </span>
                  {venue.review_count > 0 && (
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      ({venue.review_count} reseñas)
                    </span>
                  )}
                </div>
              ) : (
                // ✨ NUEVO: Badge "Nuevo" en lugar de texto negativo
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}
                >
                  <Sparkles className="w-3 h-3" />
                  Nuevo
                </span>
              )}

              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                <Users className="w-3.5 h-3.5 shrink-0" />
                Hasta {venue.max_capacity}
              </div>
            </div>

            {/* ✨ NUEVO: Chips de amenidades */}
            {previewAmenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {previewAmenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-0.5 rounded-md text-xs font-medium"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}
                  >
                    {amenity}
                  </span>
                ))}
                {venue.amenities?.length > 3 && (
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-medium"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}
                  >
                    +{venue.amenities.length - 3} más
                  </span>
                )}
              </div>
            )}

            {/* CTA Button */}
            <button
              className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                backgroundColor: "rgba(242,107,60,0.12)",
                color: "#F26B3C",
                border: "1px solid rgba(242,107,60,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F26B3C";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(242,107,60,0.12)";
                e.currentTarget.style.color = "#F26B3C";
              }}
            >
              <CalendarCheck className="w-4 h-4" />
              Ver disponibilidad
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
            <img
              src={mainImage}
