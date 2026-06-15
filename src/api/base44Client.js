import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Mapeo de entidades → tablas de Supabase
const tableMap = {
  Venue:   'venues',
  Booking: 'bookings',
  Review:  'reviews',
}

function createEntityAPI(tableName) {
  return {

    // Listar con filtros: db.entities.Venue.filter({ status: 'active' })
    filter: async (conditions = {}, options = {}) => {
      let query = supabase.from(tableName).select('*')

      Object.entries(conditions).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.contains(key, value)
        } else {
          query = query.eq(key, value)
        }
      })

      if (options.order) {
        query = query.order(options.order.field, {
          ascending: options.order.ascending ?? true,
        })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      if (options.limit) query = query.limit(options.limit)

      const { data, error } = await query
      if (error) throw error
      return data || []
    },

    // Obtener uno: db.entities.Venue.get('uuid')
    get: async (id) => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    // Crear: db.entities.Venue.create({ title: '...', ... })
    create: async (data) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([data])
        .select()
        .single()
      if (error) throw error
      return result
    },

    // Actualizar: db.entities.Venue.update('uuid', { title: '...' })
    update: async (id, data) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },

    // Eliminar: db.entities.Venue.delete('uuid')
    delete: async (id) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id)
      if (error) throw error
      return { success: true }
    },
  }
}

export const db = {

  // ── Auth ────────────────────────────────────────────────────────
  auth: {
    isAuthenticated: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session
    },

    me: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      return {
        id:    user.id,
        email: user.email,
        name:  user.user_metadata?.full_name || user.email,
        role:  user.user_metadata?.role || 'user',
      }
    },

    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    },

    loginWithGoogle: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
    },

    logout: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },

    register: async (email, password, metadata = {}) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      })
      if (error) throw error
      return data
    },
  },

  // ── Entities (Venue, Booking, Review) ───────────────────────────
  entities: new Proxy({}, {
    get: (_, entityName) => {
      const tableName = tableMap[entityName]
      if (!tableName) {
        console.warn(`Entidad "${entityName}" no está en tableMap`)
        return createEntityAPI(entityName.toLowerCase() + 's')
      }
      return createEntityAPI(tableName)
    },
  }),

  // ── Upload de imágenes ──────────────────────────────────────────
  integrations: {
    Core: {
      UploadFile: async (file) => {
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
        const { error } = await supabase.storage
          .from('venue-images')
          .upload(fileName, file)
        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('venue-images')
          .getPublicUrl(fileName)

        return { file_url: publicUrl }
      },
    },
  },
}

export const base44 = db
export default db
