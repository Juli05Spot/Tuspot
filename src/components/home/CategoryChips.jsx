import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { id: "albercada",  label: "Albercadas",       emoji: "🏊" },
  { id: "terraza",   label: "Terrazas",          emoji: "🌆" },
  { id: "salon",     label: "Salones",           emoji: "🎊" },
  { id: "quinta",    label: "Quintas",           emoji: "🌿" },
  { id: "jardin",    label: "Jardines",          emoji: "🌸" },
  { id: "rooftop",   label: "Rooftops",          emoji: "🌃" },
  { id: "carnes",    label: "Carnes Asadas",     emoji: "🥩" },
  { id: "infantil",  label: "Piñatas/Infantiles",emoji: "🎈" },
  { id: "babyshower",label: "Baby Showers",      emoji: "🍼" },
  { id: "casa",      label: "Casas Completas",   emoji: "🏠" },
];

export default function CategoryChips() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-8 text-foreground">Explora por categoría</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/explore?category=${cat.id}`)}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-sm text-white transition-colors"
            style={{
              backgroundColor: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "rgba(242,107,60,0.18)";
              e.currentTarget.style.borderColor = "rgba(242,107,60,0.55)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
            }}
          >
            <span className="text-2xl leading-none">{cat.emoji}</span>
            <span className="whitespace-nowrap">{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}