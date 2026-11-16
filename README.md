# Tienda de crochet — Next.js + Supabase + Stripe

Landing optimizada, fichas de producto (foto o vídeo), checkout con datos de envío y pago en Stripe,
y back office para pedidos y productos. Idiomas: ES, CA, EN, FR. Venta por encargo (sin stock).

Sin configurar nada arranca en **modo demo** con productos de muestra:

```bash
npm install
npm run dev        # http://localhost:3000
```

## Puesta en marcha

1. **Supabase**: crea un proyecto, abre *SQL Editor* y ejecuta `supabase/schema.sql`.
2. **Usuario admin**: en *Authentication → Users* crea un usuario con email y contraseña.
   Desactiva el registro público (*Authentication → Sign In / Providers → Allow new users to sign up*).
3. **Variables**: copia `.env.example` a `.env.local` y rellénalo. `ADMIN_EMAILS` debe incluir el email del paso 2.
4. **Stripe**: copia la clave secreta. Crea un webhook hacia `https://TU-DOMINIO/api/stripe/webhook`
   con los eventos `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed` y `checkout.session.expired`; copia su *signing secret*.
   En local: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
5. **Despliegue**: sube el repo a Vercel (o similar) con las mismas variables y `NEXT_PUBLIC_SITE_URL` = tu dominio.

## Dónde tocar

| Qué | Dónde |
| --- | --- |
| Nombre de marca, email, Instagram | `src/lib/config.ts` |
| Tarifas de envío, países, envío gratis | `src/lib/config.ts` |
| Textos de la landing (4 idiomas) | `src/lib/i18n.ts` |
| Colores y tipografías | `src/app/globals.css` |
| Productos y pedidos | Back office en `/admin` |

## Cómo funciona la compra

1. Ficha de producto → **Comprar ahora**.
2. Formulario propio: cantidad, datos de contacto y dirección de envío. El total se calcula en vivo.
3. El servidor relee el precio en la base de datos, crea el pedido como *pendiente* y redirige a Stripe Checkout.
4. Stripe confirma el pago por webhook → el pedido pasa a *pagado* y aparece en el back office.
   La página de gracias hace la misma comprobación como respaldo.

Estados de pedido: pendiente → pagado (por tejer) → tejiendo → enviado → entregado (o cancelado).

## Rediseño orientado a conversión

La especificación está en `docs/design/DESIGN.md`, las referencias visuales en `docs/design/reference/`
y el plan por fases para Claude Code en `docs/PROMPTS.md`. `CLAUDE.md` contiene el contexto y las reglas del proyecto.

## Pendiente / siguientes pasos

- Emails propios al cliente (confirmación, "tu pedido ha salido"). Hoy solo llega el recibo de Stripe si lo activas.
- Páginas legales (aviso legal, privacidad, devoluciones) e impuestos: los precios se tratan como finales.
- Compra de un producto por pedido (sin carrito). El modelo de datos ya admite varios artículos.
