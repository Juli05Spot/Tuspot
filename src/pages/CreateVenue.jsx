const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, X, Upload, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const categories = [
  { id: "albercada", label: "Albercada" },
  { id: "terraza", label: "Terraza" },
  { id: "salon", label: "Salón" },
  { id: "quinta", label: "Quinta" },
  { id: "jardin", label: "Jardín" },
  { id: "rooftop", label: "Rooftop" },
];

const commonAmenities = [
  "Alberca", "Asador/Parrilla", "Sonido", "Refrigeración",
  "Estacionamiento", "WiFi", "Pantalla/Proyector", "Cocina",
  "Seguridad", "Jardín", "Mobiliario", "Iluminación",
];

export default function CreateVenue() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => db.auth.me(),
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    address: "",
    price_per_day: "",
    max_capacity: "",
    amenities: [],
    images: [],
    extra_services: [],
  });

  const [uploading, setUploading] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: "" });

  const createVenue = useMutation({
    mutationFn: (data) => db.entities.Venue.create(data),
    onSuccess: () => {
      toast({ title: "¡Espacio publicado!", description: "Tu espacio ya está disponible." });
      navigate("/host");
    },
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addService = () => {
    if (!newService.name || !newService.price) return;
    setForm((prev) => ({
      ...prev,
      extra_services: [...prev.extra_services, { name: newService.name, price: parseFloat(newService.price) }],
    }));
    setNewService({ name: "", price: "" });
  };

  const removeService = (index) => {
    setForm((prev) => ({
      ...prev,
      extra_services: prev.extra_services.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createVenue.mutate({
      ...form,
      price_per_day: parseFloat(form.price_per_day),
      max_capacity: parseInt(form.max_capacity),
      host_email: user?.email,
      host_name: user?.full_name || "",
      rating: 0,
      review_count: 0,
      status: "active",
      blocked_dates: [],
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Button>

      <h1 className="text-3xl font-extrabold mb-2">Publicar Nuevo Espacio</h1>
      <p className="text-muted-foreground mb-8">Llena los detalles de tu espacio para eventos</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Información básica</h2>
          <div>
            <Label>Nombre del espacio</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej. Villa Paradise Pool Party"
              className="h-11 rounded-xl mt-1.5"
              required
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe tu espacio, qué lo hace especial..."
              className="rounded-xl mt-1.5 min-h-[120px]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-11 rounded-xl mt-1.5">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ciudad / Zona</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ej. Monterrey"
                className="h-11 rounded-xl mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label>Dirección completa</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Calle, número, colonia..."
              className="h-11 rounded-xl mt-1.5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Precio por día (MXN)</Label>
              <Input
                type="number"
                value={form.price_per_day}
                onChange={(e) => setForm({ ...form, price_per_day: e.target.value })}
                placeholder="5000"
                className="h-11 rounded-xl mt-1.5"
                required
              />
            </div>
            <div>
              <Label>Capacidad máxima</Label>
              <Input
                type="number"
                value={form.max_capacity}
                onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
                placeholder="100"
                className="h-11 rounded-xl mt-1.5"
                required
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold">Fotos</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Las fotos de alta calidad aumentan significativamente las reservas.</p>
          </div>

          {/* Uploaded images preview */}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Full-width drag & drop zone */}
          <label className="w-full flex flex-col items-center justify-center gap-4 py-14 px-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/5 cursor-pointer transition-all group">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Subiendo fotos...</span>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ImagePlus className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-foreground">Arrastra y suelta tus fotos aquí</p>
                  <p className="text-sm text-muted-foreground mt-1">o haz clic para seleccionar desde tu dispositivo</p>
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG, WEBP · Máximo recomendado 10 MB por foto</p>
                </div>
              </>
            )}
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Amenidades</h2>
          <div className="flex flex-wrap gap-2">
            {commonAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.amenities.includes(amenity)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Extra services */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Servicios extra (opcional)</h2>
          {form.extra_services.length > 0 && (
            <div className="space-y-2">
              {form.extra_services.map((svc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <span className="font-medium text-sm">{svc.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">${svc.price}</span>
                    <button type="button" onClick={() => removeService(i)}>
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              placeholder="Nombre del servicio"
              className="h-10 rounded-xl"
            />
            <Input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              placeholder="Precio"
              className="h-10 rounded-xl w-32"
            />
            <Button type="button" variant="outline" onClick={addService} className="rounded-xl shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={createVenue.isPending}
          className="w-full h-12 bg-primary hover:bg-primary/90 font-bold rounded-xl text-base"
        >
          {createVenue.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Publicar Espacio
        </Button>
      </form>
    </div>
  );
}