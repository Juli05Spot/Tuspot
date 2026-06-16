import React from 'react'
import ReactDOM from 'react-dom/client'
import db from '@/api/base44Client'
import App from '@/App.jsx'
import '@/index.css'
import 'leaflet/dist/leaflet.css'

// Inyecta la conexión real de Supabase en la variable global que
// los archivos del proyecto (heredados de Base44) esperan encontrar.
// Sin esto, cada página cae en el mock vacío y nunca muestra datos reales.
globalThis.__B44_DB__ = db

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
