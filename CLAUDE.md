# Tienda de crochet

Tienda online de artículos de crochet hechos a mano **por encargo** (sin stock). Landing, fichas de
producto, checkout con datos de envío, pago en Stripe Checkout y back office de pedidos y productos.

@AGENTS.md

## Stack

- Next.js 16 (App Router, `src/`), React 19, TypeScript, Tailwind CSS 4.
- Supabase: Postgres, Auth (solo administradores) y Storage (bucket `product-media`).
- Stripe Checkout (redirección) + webhook.
- Idiomas: `es` (por defecto), `ca`, `en`, `fr`. Rutas `/{locale}/...`. El back office (`/admin`) solo en español.

Next.js 16 cambia cosas respecto a versiones anteriores: `middleware` se llama `proxy` (`src/proxy.ts`),
`params` y `searchParams` son `Promise`. Antes de usar una API de Next, lee la guía en
`node_modules/next/dist/docs/`.

## Comandos

```bash
npm run dev      # desarrollo (sin .env.local arranca en modo demo con productos de muestra)
npm run build    # debe pasar sin errores antes de dar una tarea por terminada
npx eslint src   # debe salir limpio
npx tsc --noEmit
```

## Mapa del código

| Qué | Dónde |
| --- | --- |
| Marca, idiomas, tarifas de envío | `src/lib/config.ts` |
| Textos de interfaz (4 idiomas, tipo `Dict`) | `src/lib/i18n.ts` |
| Tipos, estados de pedido, `tr()`, `formatPrice()` | `src/lib/types.ts` |
| Lectura pública de productos (+ modo demo) | `src/lib/data.ts`, `src/lib/demo.ts` |
| Clientes Supabase | `src/lib/supabase/admin.ts` (service role y anónimo), `server.ts` (sesión) |
| Stripe y `markOrderPaid` | `src/lib/stripe.ts` |
| Tienda | `src/app/[locale]/(shop)/` (landing, `p/[slug]`) y `(checkout)/` (`checkout/[slug]`, `success`, cabecera mínima) |
| Validación de campos del checkout (cliente y servidor) | `src/lib/validation.ts` |
| Acción de compra | `src/app/actions/checkout.ts` |
| Webhook | `src/app/api/stripe/webhook/route.ts` |
| Back office | `src/app/admin/`, `src/app/actions/admin.ts`, `src/components/admin/` |
| Esquema de base de datos | `supabase/schema.sql` |
| **Diseño a implementar** | `docs/design/DESIGN.md` y `docs/design/reference/*.dc.html` |
| Plan de trabajo por fases | `docs/PROMPTS.md` |

## Reglas que no se rompen

1. **El precio y el envío se calculan siempre en el servidor** a partir de la base de datos y
   `config.ts`. Nunca se confía en importes que lleguen del navegador.
2. **`SUPABASE_SERVICE_ROLE_KEY` y `STRIPE_SECRET_KEY` solo en servidor.** Los módulos que las usan
   importan `server-only`. Toda acción de `/admin` empieza con `await requireAdmin()`.
3. **RLS activado en todas las tablas.** El público solo lee productos activos (y reseñas publicadas).
   Pedidos y escrituras pasan por el servidor con service role.
4. **Un pedido solo pasa a pagado por confirmación de Stripe** (webhook o `markOrderPaid` en la página
   de gracias). La actualización es idempotente: `.eq("status", "pending")`.
5. **Todo texto visible al cliente va en los 4 idiomas** en `src/lib/i18n.ts`. `const es` define el
   tipo `Dict`; si falta una clave en otro idioma, TypeScript falla. El contenido de producto es
   `jsonb` por idioma y cae al español con `tr()`.
6. **Nada inventado en producción**: reseñas, valoraciones, contadores o urgencia falsa no se
   muestran. Si no hay reseñas reales, la sección no se renderiza.
7. **Accesibilidad**: contraste de texto ≥ 4,5:1, objetivos táctiles ≥ 44 px, controles con elementos
   nativos (`button`, `a`, `input` + `label`). Sin emoji como iconos: SVG en línea.
8. **Cambios de esquema** = nueva migración en `supabase/migrations/` + actualizar `supabase/schema.sql`
   + tipos en `src/lib/types.ts` + datos de `src/lib/demo.ts`. No se aplican migraciones a un proyecto
   Supabase real sin que el usuario lo pida.
9. Server Components por defecto. `"use client"` solo donde haya estado o eventos.

## Cómo trabajar

- Una fase de `docs/PROMPTS.md` cada vez. Termina con build, lint y tipos en verde y un resumen de
  qué cambió y qué queda sin probar.
- No añadas dependencias sin justificarlo en el resumen.
- Mobile-first: diseña y comprueba primero a 390 px de ancho.
