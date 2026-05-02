import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fallbackImages = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&h=600&fit=crop",
];

export default function PhotoGallery({ images }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const photos = images?.length > 0 ? images : fallbackImages;

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(-1);
  const goNext = () => setLightboxIndex((prev) => (prev + 1) % photos.length);
  const goPrev = () => setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        {/* Main image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={photos[0]}
            alt="Venue"
            className="w-full h-full min-h-[280px] md:min-h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
        {/* Secondary images */}
        {photos.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer group hidden md:block"
            onClick={() => openLightbox(i + 1)}
          >
            <img
              src={img}
              alt={`Venue ${i + 2}`}
              className="w-full h-full min-h-[196px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            {i === 3 && photos.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{photos.length - 5} fotos
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img
              src={photos[lightboxIndex]}
              alt="Gallery"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <div className="absolute bottom-4 text-white/70 text-sm">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}