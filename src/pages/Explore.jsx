const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useMemo, Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X, Map, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import VenueCard from "../components/shared/VenueCard";
import EmptyState from "../components/explore/EmptyState";
import FilterPanel from "../components/explore/FilterPanel";

const VenueMap = lazy(() => import("../components/explore/VenueMap"));

const categories = [
  { id: "all", label: "Todos" },
  { id: "albercada", label: "Albercadas" },
  { id: "terraza", label: "Terrazas" },
  { id: "salon", label: "Salones" },
  { id: "quinta", label: "Quintas" },
  { id: "jardin", label: "Jardines" },
  { id: "rooftop", label: "Rooftops" },
];

const DEFAULT_FILTERS = { priceRange: [0, 50000], minCapacity: 0, amenities: [] };

export default function Explore() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("rating");
  const [showMap, setShowMap] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advFilters, setAdvFilters] = useState(DEFAULT_FILTERS);

  const { data: venues, isLoading } = useQuery({
    queryKey: ["venues"],
    queryFn: () => db.entities.Venue.filter({ status: "active" }),
    initialData: [],
  });

  const activeFilterCount =
    (advFilters.priceRange[0] > 0 || advFilters.priceRange[1] < 50000 ? 1 : 0) +
    (advFilters.minCapacity > 0 ? 1 : 0) +
    advFilters.amenities.length;

  const filteredVenues = useMemo(() => {
    let filtered = venues;

    if (category !== "all") filtered = filtered.filter((v) => v.category === category);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title?.toLowerCase().includes(q) ||
          v.location?.toLowerCase().includes(q) ||
          v.description?.toLowerCase().includes(q)
      );
    }

    // Advanced filters
    filtered = filtered.filter((v) => {
      const price = v.price_per_day || 0;
      if (price < advFilters.priceRange[0] || price > advFilters.priceRange[1]) return false;
      if (v.max_capacity < advFilters.minCapacity) return false;
      if (advFilters.amenities.length > 0) {
        const venueAmenities = (v.amenities || []).map((a) => a.toLowerCase());
        const hasAll = advFilters.amenities.every((a) =>
          venueAmenities.some((va) => va.includes(a.toLowerCase()))
        );
        if (!hasAll) return false;
      }
      return true;
    });

    if (sortBy === "rating") filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "price_low") filtered = [...filtered].sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0));
    else if (sortBy === "price_high") filtered = [...filtered].sort((a, b) => (b.price_per_day || 0) - (a.price_per_day || 0));
    else if (sortBy === "capacity") filtered = [...filtered].sort((a, b) => (b.max_capacity || 0) - (a.max_capacity || 0));

    return filtered;
  }, [venues, category, search, sortBy, advFilters]);

  const MapFallback = (
    <div className="w-full h-full flex items-center justify-center bg-neutral-900">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* ── Top bar ── */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 border-b border-border bg-background shrink-0">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar espacios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center gap-2 h-11 px-4 rounded-xl text-sm font-semibold border transition-all shrink-0 ${
              filtersOpen || activeFilterCount > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/70"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="bg-white/20 rounded-full text-xs px-1.5 py-0.5 font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Mejor calificados</SelectItem>
              <SelectItem value="price_low">Precio: menor a mayor</SelectItem>
              <SelectItem value="price_high">Precio: mayor a menor</SelectItem>
              <SelectItem value="capacity">Mayor capacidad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Filter panel — slides in from left on desktop too */}
        <FilterPanel
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          filters={advFilters}
          onChange={setAdvFilters}
        />

        {/* Venue list */}
        <div
          className={`
            flex-shrink-0 overflow-y-auto
            ${showMap ? "hidden" : "block"} sm:block
            w-full sm:w-[42%] lg:w-[38%]
            border-r border-border bg-background
          `}
        >
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] rounded-2xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredVenues.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredVenues.length} espacio{filteredVenues.length !== 1 ? "s" : ""} encontrado{filteredVenues.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 gap-5 pb-20">
                  {filteredVenues.map((venue, i) => (
                    <div
                      key={venue.id}
                      onMouseEnter={() => setActiveId(venue.id)}
                      onMouseLeave={() => setActiveId(null)}
                      className={`rounded-2xl transition-all duration-200 ${
                        activeId === venue.id ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <VenueCard venue={venue} index={i} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Map */}
        <div
          className={`
            flex-1 relative
            ${showMap ? "block" : "hidden"} sm:block
          `}
        >
          <Suspense fallback={MapFallback}>
            {!isLoading && (
              <VenueMap
                venues={filteredVenues}
                activeId={activeId}
                onPinHover={setActiveId}
              />
            )}
          </Suspense>
        </div>
      </div>

      {/* Mobile floating toggle */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 sm:hidden">
        <button
          onClick={() => setShowMap((v) => !v)}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "#1f1f1f",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.55)",
          }}
        >
          {showMap ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
          {showMap ? "Ver lista" : "Mostrar mapa"}
        </button>
      </div>
    </div>
  );
}