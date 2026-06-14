import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { id: "albercada",   label: "Albercadas",          emoji: "🏊", color: "rgba(14,116,189,0.18)",  border: "rgba(14,116,189,0.45)",  hover: "rgba(14,116,189,0.28)"  },
  { id: "terraza",     label: "Terrazas",             emoji: "🌆", color: "rgba(139,92,246,0.18)",  border: "rgba(139,92,246,0.45)",  hover: "rgba(139,92,246,0.28)"  },
  { id: "salon",       label: "Salones",              emoji: "🎊", color: "rgba(242,107,60,0.18)",  border: "rgba(242,107,60,0.45)",  hover: "rgba(242,107,60,0.28)"  },
  { id: "quinta",      label: "Quintas",              emoji: "🌿", color: "rgba(34,197,94,0.18)",   border: "rgba(34,197,94,0.45)",   hover: "rgba(34,197,94,0.28)"   },
  { id: "jardin",      label: "Jardines",             emoji: "🌸", color: "rgba(236,72,153,0.18)",  border: "rgba(236,72,153,0.45)",  hover: "rgba(236,72,153,0.28)"  },
  { id: "rooftop",     label: "Rooftops",             emoji: "🌃", color: "rgba(99,102,241,0.18)",  border: "rgba(99,102,241,0.45)",  hover: "rgba(99,102,241,0.28)"  },
  { id: "carnes",      label: "Carnes Asadas",        emoji: "🥩", color: "rgba(239,68,68,0.18)",   border: "rgba(239,68,68,0.45)",   hover: "rgba(239,68,68,0.28)"   },
  { id: "infantil",    label: "Piñatas/Infantiles",   emoji: "🎈", color: "rgba(234,179,8,0.18)",   border: "rgba(234,179,8,0.45)",   hover: "rgba(234,179,8,0.28)"   },
  { id: "babyshower",  label: "Baby Showers",         emoji: "🍼", color: "rgba(20,184,166,0.18)",  border: "rgba(20,184,166,0.45)",  hover: "rgba(20,184,166,0.28)"  },
  { id: "casa",        label: "Casas Completas",      emoji: "🏠", color: "rgba(245,158,11,0.18)",  border: "rgba(245,158,11,0.45)",  hover: "rgba(245,158,11,0.28)"  },
];

export default function CategoryChips() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-8 text-foreground">Explora por categoría</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/explore?category=${cat.id}`)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm text-white transition-all duration-200"
            style={{
              backgroundColor: cat.color,
              border: `1px solid ${cat.border}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = cat.hover;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = cat.color;
            }}
          >
            <span className="text-xl leading-none">{cat.emoji}</span>
            <span className="whitespace-nowrap">{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
