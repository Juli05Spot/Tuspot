import React from "react";
import HeroSection from "../components/home/HeroSection";
import CategoryChips from "../components/home/CategoryChips";
import TrendingVenues from "../components/home/TrendingVenues";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryChips />
      <TrendingVenues />
      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            ¿Tienes un espacio para eventos?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Publica tu espacio gratis y empieza a recibir reservaciones hoy mismo.
          </p>
          <a
            href="/host/new"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Publicar mi espacio
          </a>
        </div>
      </section>
    </div>
  );
}