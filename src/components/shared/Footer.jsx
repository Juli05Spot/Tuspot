import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const columns = [
  {
    title: "Descubre",
    links: [
      { label: "Albercadas", href: "/explore?category=albercada" },
      { label: "Terrazas", href: "/explore?category=terraza" },
      { label: "Salones", href: "/explore?category=salon" },
    ],
  },
  {
    title: "Anfitriones",
    links: [
      { label: "Publicar un espacio", href: "/host/new" },
      { label: "Panel de control", href: "/host" },
    ],
  },
  {
    title: "Soporte y Legal",
    links: [
     { label: "Contacto / Ayuda", href: "https://wa.me/526623999505" },
{ label: "Términos y Condiciones", href: "#" },
{ label: "Aviso de Privacidad", href: "https://tuspot.lat/privacy.html" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1C1C1C" }} className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-extrabold text-primary tracking-tight">TuSpot</span>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Encuentra tu espacio ideal para cada ocasión.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
  {col.links.map((link) => (
    <li key={link.label}>
      
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white/55 hover:text-primary transition-colors"
      >
        {link.label}
      </a>
    </li>
  ))}
</ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} TuSpot. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/35 hover:text-primary transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="text-white/35 hover:text-primary transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="text-white/35 hover:text-primary transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
