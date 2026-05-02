import React from "react";
import { Link } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-24 px-6"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="w-32 h-32 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center">
            <div className="relative">
              <Search className="w-9 h-9 text-primary/70" />
              <MapPin className="w-4 h-4 text-primary absolute -bottom-1 -right-2" />
            </div>
          </div>
        </div>
        {/* Floating dots */}
        <span className="absolute top-2 right-0 w-2.5 h-2.5 rounded-full bg-primary/30 animate-pulse" />
        <span className="absolute bottom-3 left-0 w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse delay-300" />
        <span className="absolute top-8 -left-3 w-2 h-2 rounded-full bg-primary/15 animate-pulse delay-150" />
      </div>

      {/* Text */}
      <h3 className="text-2xl font-extrabold text-foreground mb-3">
        Aún no tenemos espacios aquí.
      </h3>
      <p className="text-muted-foreground max-w-md leading-relaxed mb-8">
        Estamos creciendo nuestro catálogo todos los días. Si tienes un espacio increíble en esta zona,{" "}
        <span className="text-foreground font-medium">¡súbelo y sé el primero en recibir reservas!</span>
      </p>

      {/* CTA */}
      <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 h-auto rounded-xl text-base">
        <Link to="/host/new">Publicar mi espacio</Link>
      </Button>
    </motion.div>
  );
}