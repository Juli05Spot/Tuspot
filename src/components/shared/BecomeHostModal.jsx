import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { value: "albercada", label: "🏊 Albercada" },
  { value: "terraza", label: "🌆 Terraza" },
  { value: "salon", label: "🎊 Salón de Eventos" },
  { value: "quinta", label: "🌿 Quinta / Rancho" },
  { value: "jardin", label: "🌸 Jardín" },
  { value: "rooftop", label: "🌃 Rooftop" },
];

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function BecomeHostModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", category: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.category) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", category: "" });
    }, 400);
  };

  const whatsappNumber = "521234567890"; // replace with real number
  const whatsappMessage = encodeURIComponent(
    `Hola, soy ${form.name}. Me registré en Eventspace y quiero publicar mi espacio tipo "${form.category}". ¡Aquí van mis fotos y detalles!`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  /* ── STEP 1: LEAD FORM ── */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.22 }}
                  >
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-primary via-orange-400 to-amber-400 px-8 pt-10 pb-8 text-white overflow-hidden">
                      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
                      <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/10" />
                      <div className="relative">
                        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                          <Sparkles className="w-3 h-3" />
                          Registro en 30 segundos
                        </div>
                        <h2 className="text-2xl font-extrabold leading-tight mb-2">
                          Empieza a ganar con<br />tu espacio hoy
                        </h2>
                        <p className="text-white/80 text-sm">
                          Solo 3 datos y nosotros hacemos el resto.
                        </p>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Nombre completo
                        </label>
                        <Input
                          placeholder="Ej. María González"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="h-12 rounded-xl border-border/60 focus-visible:ring-primary text-base"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          WhatsApp
                        </label>
                        <div className="relative">
                          <WhatsAppIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                          <Input
                            placeholder="Ej. 81 1234 5678"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="h-12 rounded-xl border-border/60 focus-visible:ring-primary text-base pl-10"
                            type="tel"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Tipo de espacio
                        </label>
                        <div className="relative">
                          <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full h-12 rounded-xl border border-border/60 bg-background px-3 pr-10 text-base text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          >
                            <option value="" disabled>Selecciona una categoría</option>
                            {CATEGORIES.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold text-base mt-2"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </span>
                        ) : (
                          "Publicar mi espacio →"
                        )}
                      </Button>

                      <p className="text-center text-xs text-muted-foreground pt-1">
                        Sin costo · Sin compromiso · Configuración asistida
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  /* ── STEP 2: BIFURCATION SUCCESS ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="px-8 pt-10 pb-8"
                  >
                    {/* Animated WA icon */}
                    <div className="flex justify-center mb-5">
                      <motion.div
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.05 }}
                        className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200"
                      >
                        <WhatsAppIcon className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-center mb-7"
                    >
                      <h3 className="text-2xl font-extrabold text-foreground mb-3">
                        ¡Listo, {form.name.split(" ")[0]}! 🎉
                      </h3>
                      <p className="text-foreground/80 leading-relaxed mb-1">
                        Te acabamos de enviar un mensaje por{" "}
                        <span className="font-bold text-green-600">WhatsApp</span>.
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Solo responde con las fotos y detalles de tu espacio y te ayudamos a configurar tu perfil en minutos.
                      </p>
                    </motion.div>

                    {/* Primary CTA */}
                    <motion.a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 }}
                      className="flex items-center justify-center gap-3 w-full h-13 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors font-bold text-white text-base shadow-md shadow-green-200 mb-4"
                      onClick={handleClose}
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Abrir WhatsApp ahora
                      <ArrowRight className="w-4 h-4" />
                    </motion.a>

                    {/* Divider */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3 mb-4"
                    >
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground font-medium">o si prefieres</span>
                      <div className="flex-1 h-px bg-border" />
                    </motion.div>

                    {/* Secondary CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-center"
                    >
                      <Link
                        to="/host/new"
                        onClick={handleClose}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-medium group"
                      >
                        Continuar configurando mi perfil en la web
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}