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
