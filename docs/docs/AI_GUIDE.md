# AI GUIDE

## Objetivo

Este documento define cómo debe trabajar cualquier asistente de IA dentro del proyecto Tuspot.

---

# Antes de modificar código

Siempre realizar el siguiente proceso:

1. Analizar el proyecto completo.

2. Encontrar la causa raíz del problema.

3. Buscar componentes relacionados.

4. Buscar llamadas a Supabase.

5. Buscar posibles efectos secundarios.

6. Explicar el problema.

7. Explicar la solución propuesta.

8. Modificar únicamente los archivos necesarios.

9. Explicar exactamente qué cambió.

---

# Nunca hacer

- Romper funcionalidades existentes.
- Duplicar componentes.
- Crear código innecesario.
- Agregar dependencias sin justificación.
- Modificar la base de datos sin documentarlo.

---

# Siempre hacer

- Mantener código limpio.
- Mantener componentes reutilizables.
- Mantener una arquitectura consistente.
- Pensar en escalabilidad.
- Documentar cambios importantes.

---

# Filosofía

Si existen dos soluciones válidas, elegir siempre la más simple, mantenible y escalable.
