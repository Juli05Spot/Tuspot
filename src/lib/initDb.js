// Este archivo debe importarse ANTES que cualquier otro módulo de la app.
// Define globalThis.__B44_DB__ inmediatamente, para que cuando los demás
// archivos (Explore.jsx, VenueDetail.jsx, etc.) se evalúen, la variable
// global ya exista y usen Supabase real en vez de el mock vacío.
import db from '@/api/base44Client'

globalThis.__B44_DB__ = db
