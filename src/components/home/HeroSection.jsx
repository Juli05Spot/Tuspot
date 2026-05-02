import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_CHIPS = [
  { emoji: "🎉", label: "Fiesta", category: "salon" },
  { emoji: "🏊", label: "Albercada", category: "albercada" },
  { emoji: "💍", label: "Boda", category: "jardin" },
  { emoji: "🎂", label: "Cumpleaños", category: "terraza" },
];

const TRUST_BADGES = [
  "Espacios verificados",
  "Pagos seguros",
  "+10,000 eventos realizados",
];

const GUEST_OPTIONS = [
  { label: "Hasta 50 personas", value: "50" },
  { label: "50 – 100 personas", value: "100" },
  { label: "100 – 200 personas", value: "200" },
  { label: "Más de 200 personas", value: "200+" },
];

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    navigate(`/explore?${params.toString()}`);
  };

  const handleChip = (category) => {
    navigate(`/explore?category=${category}`);
  };

  useEffect(() => {
    const handler = () => setActiveField(null);
    if (activeField) document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [activeField]);

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center" style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2a2a 0%, #1c1c1c 55%, #141414 100%)" }}>
      {/* Subtle glow accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">

        {/* Trust pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Marketplace #1 de espacios para eventos en México
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white text-center leading-tight tracking-tight mb-5"
        >
          Reserva espacios para eventos{" "}
          <span className="text-primary">en minutos,</span>
          <br className="hidden sm:block" />
          {" "}sin complicaciones
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/65 text-center max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Encuentra albercas, salones, casas y jardines verificados en todo México.
          Filtra por precio, capacidad y ubicación.
        </motion.p>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="mb-8"
        >
          {/* Desktop */}
          <div className="hidden sm:flex items-stretch rounded-2xl overflow-visible shadow-2xl border border-white/10"
            style={{ backgroundColor: "rgba(15,15,15,0.85)", backdropFilter: "blur(20px)" }}
          >
            {/* Ubicación */}
            <div className="relative flex-1">
              <div className="w-full h-full flex flex-col justify-center px-5 py-4 rounded-l-2xl hover:bg-white/5 transition-colors cursor-text">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Ubicación</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <input
                    type="text"
                    placeholder="¿Dónde será tu evento?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setActiveField("location")}
                    className="bg-transparent text-white text-sm font-medium placeholder:text-white/30 outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="w-px self-stretch my-3 bg-white/10" />

            {/* Fecha */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveField(activeField === "date" ? null : "date"); }}
                className="w-full h-full flex flex-col justify-center px-5 py-4 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Fecha</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span className={`text-sm font-medium ${date ? "text-white" : "text-white/30"}`}>
                    {date ? new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "Selecciona fecha"}
                  </span>
                </div>
              </button>
              <AnimatePresence>
                {activeField === "date" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 z-50 w-64 rounded-2xl border border-white/10 shadow-2xl p-4"
                    style={{ backgroundColor: "#141414" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="text-[10px] text-white/40 mb-3 font-bold uppercase tracking-widest">Selecciona fecha</p>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => { setDate(e.target.value); setActiveField(null); }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-primary/50"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px self-stretch my-3 bg-white/10" />

            {/* Personas */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveField(activeField === "guests" ? null : "guests"); }}
                className="w-full h-full flex flex-col justify-center px-5 py-4 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Personas</span>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span className={`text-sm font-medium ${guests ? "text-white" : "text-white/30"}`}>
                    {guests ? `${guests} personas` : "¿Cuántos invitados?"}
                  </span>
                </div>
              </button>
              <AnimatePresence>
                {activeField === "guests" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 z-50 w-56 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    style={{ backgroundColor: "#141414" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {GUEST_OPTIONS.map((opt) => (
                      <button
                        key={opt.value} type="button"
                        onClick={() => { setGuests(opt.value); setActiveField(null); }}
                        className="w-full flex items-center px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <div className="p-2.5 flex items-center shrink-0">
              <Button
                type="submit"
                className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm gap-2"
              >
                <Search className="w-4 h-4" />
                Encontrar mi lugar ideal
              </Button>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/10"
              style={{ backgroundColor: "rgba(15,15,15,0.85)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="w-4 h-4 text-primary/70 shrink-0" />
                <input
                  type="text" placeholder="¿Dónde será tu evento?"
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                <input
                  type="date" value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Users className="w-4 h-4 text-primary/70 shrink-0" />
                <select value={guests} onChange={(e) => setGuests(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: guests ? "white" : "rgba(255,255,255,0.3)" }}
                >
                  <option value="" disabled>¿Cuántos invitados?</option>
                  {GUEST_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" size="lg" className="h-12 w-full rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2">
              <Search className="w-4 h-4" />
              Encontrar mi lugar ideal
            </Button>
          </div>
        </motion.form>

        {/* Quick chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-14"
        >
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleChip(chip.category)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white/80 border border-white/15 hover:border-primary/50 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <span>{chip.emoji}</span>
              {chip.label}
            </button>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {TRUST_BADGES.map((badge) => (
            <span key={badge} className="flex items-center gap-1.5 text-sm text-white/55 font-medium">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}