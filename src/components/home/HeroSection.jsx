import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

// Fotos reales de espacios publicados en TuSpot — anclan el hero en el
// producto real en lugar de un fondo abstracto genérico.
const BG_PHOTOS = [
  "https://i.ibb.co/1fhHwmkZ/image.png",
  "https://i.ibb.co/KxBMVvDb/image.png",
  "https://i.ibb.co/GQQ1YfhQ/image.png",
  "https://i.ibb.co/Rkrgwk1r/image.png",
];

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("q", location.trim());
    navigate(`/explore?${params.toString()}`);
  };

  const handleChip = (category) => {
    navigate(`/explore?category=${category}`);
  };

  // Cierra el picker activo con Escape, como cualquier modal decente.
  useEffect(() => {
    if (!activeField) return;
    const onKey = (e) => e.key === "Escape" && setActiveField(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeField]);

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* ── Fondo: collage de espacios reales + overlay oscuro ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {BG_PHOTOS.map((src) => (
            <motion.div
              key={src}
              className="relative overflow-hidden"
              initial={{ scale: 1.08 }}
              animate={prefersReducedMotion ? {} : { scale: 1 }}
              transition={{ duration: 20, ease: "easeOut" }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.78) 0%, rgba(14,14,14,0.86) 45%, rgba(10,10,10,0.97) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, rgba(242,107,60,0.20) 0%, transparent 60%)",
          }}
        />
      </div>

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
          <span className="text-primary font-serif italic font-bold">en minutos</span>,
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
          <div
            className="hidden sm:flex items-stretch rounded-2xl shadow-2xl border border-white/10"
            style={{ backgroundColor: "rgba(15,15,15,0.85)", backdropFilter: "blur(20px)" }}
          >
            {/* Ubicación */}
            <div className="flex-1">
              <div className="w-full h-full flex flex-col justify-center px-5 py-4 rounded-l-2xl hover:bg-white/5 transition-colors cursor-text">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Ubicación</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <input
                    type="text"
                    placeholder="¿Dónde será tu evento?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent text-white text-sm font-medium placeholder:text-white/30 outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="w-px self-stretch my-3 bg-white/10" />

            {/* Fecha — abre un picker centrado, no un dropdown anclado */}
            <button
              type="button"
              onClick={() => setActiveField("date")}
              className="flex-1 flex flex-col justify-center px-5 py-4 hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Fecha</span>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                <span className={`text-sm font-medium ${date ? "text-white" : "text-white/30"}`}>
                  {date ? new Date(date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "Selecciona fecha"}
                </span>
              </div>
            </button>

            <div className="w-px self-stretch my-3 bg-white/10" />

            {/* Personas — mismo patrón */}
            <button
              type="button"
              onClick={() => setActiveField("guests")}
              className="flex-1 flex flex-col justify-center px-5 py-4 hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Personas</span>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                <span className={`text-sm font-medium ${guests ? "text-white" : "text-white/30"}`}>
                  {guests ? `${guests} personas` : "¿Cuántos invitados?"}
                </span>
              </div>
            </button>

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

      {/* Borde inferior tipo "papel picado" — transición hacia el resto de
          la página con un guiño sutil a la decoración mexicana de fiestas. */}
      <svg
        className="absolute bottom-0 left-0 w-full h-5 sm:h-7 z-10 text-background fill-current"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 Q5,10 10,0 T20,0 T30,0 T40,0 T50,0 T60,0 T70,0 T80,0 T90,0 T100,0 T110,0 T120,0 T130,0 T140,0 T150,0 T160,0 T170,0 T180,0 T190,0 T200,0 L200,10 L0,10 Z" />
      </svg>

      {/* ── Pickers centrados: SIEMPRE flotan en medio de la pantalla, ──
          nunca anclados a un campo específico. Esto es lo que elimina
          por completo el riesgo de que se sobrepongan con los chips o
          cualquier otro contenido, sin importar el tamaño de pantalla. */}
      <AnimatePresence>
        {activeField && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
              onClick={() => setActiveField(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs rounded-2xl border border-white/10 shadow-2xl p-5"
              style={{ backgroundColor: "#171717" }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest">
                  {activeField === "date" ? "Selecciona fecha" : "¿Cuántos invitados?"}
                </p>
                <button onClick={() => setActiveField(null)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeField === "date" && (
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => { setDate(e.target.value); setActiveField(null); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-primary/50"
                  autoFocus
                />
              )}

              {activeField === "guests" && (
                <div className="flex flex-col gap-1">
                  {GUEST_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setGuests(opt.value); setActiveField(null); }}
                      className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
