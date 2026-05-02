import React from "react";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

const AMENITIES = [
  "WiFi",
  "Estacionamiento",
  "Cocina",
  "Bar",
  "Sonido",
  "Iluminación",
  "Climatización",
  "Alberca",
  "Jardín",
  "Terraza",
  "Seguridad",
  "Proyector",
];

const CAPACITY_OPTIONS = [
  { label: "Cualquiera", value: 0 },
  { label: "50+", value: 50 },
  { label: "100+", value: 100 },
  { label: "200+", value: 200 },
  { label: "500+", value: 500 },
];

const DEFAULT_PRICE_RANGE = [0, 50000];

export default function FilterPanel({ open, onClose, filters, onChange }) {
  const { priceRange, minCapacity, amenities } = filters;

  const toggleAmenity = (a) => {
    const next = amenities.includes(a)
      ? amenities.filter((x) => x !== a)
      : [...amenities, a];
    onChange({ ...filters, amenities: next });
  };

  const activeCount =
    (priceRange[0] > DEFAULT_PRICE_RANGE[0] || priceRange[1] < DEFAULT_PRICE_RANGE[1] ? 1 : 0) +
    (minCapacity > 0 ? 1 : 0) +
    amenities.length;

  const reset = () =>
    onChange({ priceRange: DEFAULT_PRICE_RANGE, minCapacity: 0, amenities: [] });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed sm:relative top-0 left-0 h-full z-50 sm:z-auto
              w-72 sm:w-64 lg:w-72 shrink-0
              bg-card border-r border-border
              flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm">Filtros</span>
                {activeCount > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-bold">
                    {activeCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {activeCount > 0 && (
                  <button
                    onClick={reset}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Limpiar
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="sm:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">

              {/* Price range */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Precio por día
                </p>
                <Slider
                  min={0}
                  max={50000}
                  step={500}
                  value={priceRange}
                  onValueChange={(val) => onChange({ ...filters, priceRange: val })}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-primary">${priceRange[0].toLocaleString()}</span>
                  <span className="text-primary">${priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Min capacity */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Capacidad mínima
                </p>
                <div className="flex flex-wrap gap-2">
                  {CAPACITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onChange({ ...filters, minCapacity: opt.value })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        minCapacity === opt.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Amenidades
                </p>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => {
                    const active = amenities.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? "bg-primary/15 border-primary text-primary"
                            : "bg-transparent border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}