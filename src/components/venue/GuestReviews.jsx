import React from "react";
import { Star } from "lucide-react";

const AVATAR_COLORS = ["#7C3AED", "#F26B3C", "#10B981", "#3B82F6", "#F59E0B"];

function StarRow({ rating, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={size}
          style={{
            fill: s <= Math.round(rating) ? "#F26B3C" : "transparent",
            color: s <= Math.round(rating) ? "#F26B3C" : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

function Avatar({ name, index }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", { month: "short", year: "numeric" });
}

export default function GuestReviews({ reviews = [], aggregateRating, reviewCount }) {
  // Compute aggregate from reviews array if not provided
  const rating =
    aggregateRating ||
    (reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0);

  const count = reviewCount || reviews.length;

  if (count === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Reseñas de Invitados</h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            {count} reseña{count !== 1 ? "s" : ""} verificada{count !== 1 ? "s" : ""}
          </p>
        </div>
        {/* Aggregate score */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl sm:ml-auto"
          style={{ backgroundColor: "#1f1f1f", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="text-4xl font-extrabold" style={{ color: "#F26B3C" }}>
            {rating.toFixed(1)}
          </span>
          <div className="flex flex-col gap-1">
            <StarRow rating={rating} size="w-5 h-5" />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Calificación promedio
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable cards */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {reviews.slice(0, 6).map((review, i) => (
          <div
            key={review.id || i}
            className="flex flex-col gap-3 p-4 rounded-2xl shrink-0 w-72 sm:w-80"
            style={{
              backgroundColor: "#2A2A2A",
              border: "1px solid rgba(255,255,255,0.07)",
              minWidth: "280px",
            }}
          >
            {/* Top: avatar + name + date */}
            <div className="flex items-center gap-3">
              <Avatar name={review.reviewer_name} index={i} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {review.reviewer_name || "Invitado"}
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {formatDate(review.created_date)}
                </p>
              </div>
              <StarRow rating={review.rating} size="w-3.5 h-3.5" />
            </div>

            {/* Comment */}
            <p
              className="text-sm leading-relaxed line-clamp-4"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {review.comment || "¡Excelente experiencia! Muy recomendado."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}