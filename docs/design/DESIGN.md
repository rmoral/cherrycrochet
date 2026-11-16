# Diseño orientado a conversión — especificación

Referencia visual: los cuatro archivos de `docs/design/reference/` (landing escritorio, landing móvil,
ficha móvil, checkout móvil). Son HTML con estilos en línea: **los valores exactos de color, tamaño,
radio y espaciado se leen ahí**. Este documento explica el porqué y las reglas; si hay conflicto,
manda este documento.

Los textos entre corchetes (`[RESEÑA REAL 1]`, `[TU NOMBRE]`) son huecos para contenido del dueño.
No se publican: ver «Contenido pendiente».

## 1. Diagnóstico de la versión actual

| Problema | Efecto en la conversión | Solución |
| --- | --- | --- |
| No dice cuándo llega el pedido, solo «lista en N días» | En un producto por encargo es la duda principal; sin fecha, se abandona | Fecha estimada de entrega en ficha, barra fija y checkout |
| Sin prueba social | Marca desconocida + pago por adelantado = desconfianza | Reseñas reales con foto en landing y ficha; nota media en el hero |
| El hero tiene dos botones del mismo peso | Divide la atención | Un único CTA repetido por la página |
| Las tarjetas no muestran plazo | Obliga a entrar para saberlo | Plazo y distintivo en la tarjeta |
| No se puede elegir color | La personalización va a un campo de notas que casi nadie ve | Selector de color en la ficha |
| El botón de pago no dice el importe | Incertidumbre en el último paso | «Ir al pago seguro · 28,90 €» |
| El checkout tiene el menú completo | Ofrece salidas en el momento de pagar | Cabecera mínima + indicador de pasos |
| Texto blanco sobre coral (contraste 3:1) y precios coral sobre crema (2,8:1) | Ilegible al sol en móvil; falla WCAG AA | Texto tinta sobre coral; precios en coral oscuro |
| Emoji como iconos | Se ven distinto en cada sistema; aspecto poco cuidado | Iconos SVG en línea |
| Nadie detrás de la marca | Lo hecho a mano se vende por quien lo hace | Bloque «Quién teje» |

## 2. Sistema visual

Dirección: **pegatina alegre**. Fondo crema, borde tinta de 2 px, sombra dura sin desenfoque, formas
muy redondeadas, colores planos. Sin degradados.

### Color (`src/app/globals.css`, bloque `@theme`)

| Token | Hex | Uso |
| --- | --- | --- |
| `cream` | `#FFF7EC` | Fondo de página |
| `ink` | `#2B2140` | Texto, bordes, sombras, pie |
| `coral` | `#FF5C6C` | Relleno del CTA (texto **tinta** encima, nunca blanco) |
| `coral-deep` | `#B3243A` | Precios, enlaces en hover, errores (6,1:1 sobre crema) |
| `sun` | `#FFC83D` | Distintivos, banda del CTA final, paso 1 |
| `sun-deep` | `#B87A00` | Estrellas |
| `mint` | `#22B8A7` | Barra de progreso de envío gratis |
| `mint-soft` | `#D9F4F0` | Caja de fecha de entrega, foto de quien teje |
| `mint-deep` | `#17705F` | Iconos de verificación |
| `grape` | `#7A55C7` | Franja de confianza (texto blanco, 5,3:1) |
| `blush` | `#FFE1E6` | Fondo de fotos, sección «cómo funciona» |
| `line` | `#EFE6D8` | Separadores suaves |
| `muted` | `#5B5470` | Texto secundario, paso inactivo |
| `field` | `#8A8499` | Borde de campos de formulario |

Nuevos respecto al código actual: `coral-deep`, `sun-deep`, `mint-soft`, `mint-deep`, `line`, `muted`, `field`.

### Tipografía

- Títulos, precios y botones: **Baloo 2** 700–800, interlineado 1–1,1.
- Texto: **Nunito** 400/700/800, interlineado 1,5.
- Escala móvil / escritorio: h1 42 / 44–76 (`clamp`), h2 34 / 48, h3 20 / 26, texto 16 / 17,
  precio de ficha 46, precio de tarjeta 24 / 28.
- Campos de formulario a 16 px como mínimo (evita el zoom automático de iOS).

### Forma

- Borde: `2px solid ink` en tarjetas, botones, campos de foto y secciones con fondo.
- Sombra: `0 5px 0 ink` (tarjetas y CTA), `0 4px 0 ink` (tarjetas en móvil, barra fija), `0 3px 0 ink` (botón pequeño).
- Radios: 999 px botones y distintivos · 24–28 px tarjetas y fotos · 16–20 px acordeones y cajas · 12 px campos.
- Ancho máximo: 1120 px (contenido), 760 px (preguntas y CTA final). Márgenes laterales 24 / 16 px.
- Espaciado vertical de sección: 72 px escritorio, 44 px móvil.

### Componentes base (crear en `src/components/ui/`)

- `Button` (`a` o `button`): variantes `primary` (coral + texto tinta) y `ghost` (blanco). Tamaños `lg` (CTA), `md`, `sm`. Altura mínima 44 px.
- `Icon`: SVG en línea de trazo (`check`, `calendar`, `lock`, `play`, `plus`, `minus`, `yarn`). `aria-hidden` salvo que sea el único contenido.
- `Badge`: pastilla `sun` con borde.
- `Stars`: valoración con `role="img"` y `aria-label`.
- `PhotoFrame`: marco de foto/vídeo con relación de aspecto fija (evita saltos de maquetación).
- `Accordion`: `details/summary` nativo.

## 3. Landing

Orden de secciones y motivo:

1. **Barra de anuncio** (tinta): «Envío gratis desde {importe} · Tejido a mano por encargo · Pago seguro». El importe sale de `shipping.freeFromCents`.
2. **Cabecera**: logo, navegación (solo escritorio) y selector de idioma. En móvil: logo + botón «Tienda».
3. **Hero**: distintivo, h1 con el beneficio, una frase, **un solo CTA** («Elegir mi pieza» → `#tienda`), línea de datos («Desde {precio mínimo} · Lista en {min}–{max} días · Envío a toda Europa», calculada de los productos) y nota media (solo si hay reseñas). A la derecha (debajo en móvil), foto o vídeo del producto destacado con etiqueta de nombre y precio, enlazada a su ficha. En móvil el CTA queda por encima de la foto: debe verse sin hacer scroll en 390 × 844.
4. **Franja de confianza** (uva): 4 garantías. 2 × 2 en móvil.
5. **Productos** («Las más pedidas»): 3 columnas en escritorio, 2 en móvil. Tarjeta: foto cuadrada, distintivo opcional, nombre, «Lista en N días», precio y botón «Ver pieza» (solo escritorio). Toda la tarjeta es un enlace.
   - Distintivo: `featured` → «Más vendido»; si `price_cents ≥ freeFromCents` → «Envío gratis».
6. **Opiniones**: hasta 3 reseñas con foto del cliente. **Solo si existen reseñas publicadas.**
7. **Cómo funciona**: 3 pasos con tiempos («Hoy», «5 a 15 días», «2 a 7 días») calculados de los datos.
8. **Quién teje**: foto + dos párrafos + email. Textos en `i18n.ts`; la sección se oculta si están vacíos.
9. **Preguntas** («Antes de pedir»): plazo, envío (tarifas desde `config.ts`), color, devoluciones. La primera abierta. Mantener el JSON-LD `FAQPage`.
10. **CTA final** (banda sol) y **pie** con enlaces legales.

## 4. Ficha de producto

Orden en móvil (en escritorio: galería a la izquierda, columna de compra a la derecha y fija al hacer scroll):

1. **Galería**: el vídeo va primero si existe (silenciado, en bucle, `playsInline`, con `poster`). Contador «1 / 5», miniaturas de 62 px. Deslizable con el dedo (`scroll-snap`).
2. **Nombre, valoración** (enlace a `#opiniones`, solo si hay reseñas) **y precio** con «Envío desde {mínimo} · gratis desde {umbral}».
3. **Caja de fecha de entrega** (`mint-soft`, icono calendario): «Recíbela entre el {fecha mín} y el {fecha máx}». Ver §6.
4. **Selector de color** (solo si el producto tiene colores): círculos de 46 px, el elegido con doble anillo; etiqueta «Color: {nombre}». El color viaja al checkout por query string (`?color=`).
5. **CTA** «Comprar ahora · {precio}» + línea «Pago seguro con tarjeta, Apple Pay o Google Pay».
6. **Garantías**: 3 líneas con verificación.
7. **Acordeones**: Descripción (abierto), Medidas y materiales, Envío y devoluciones, Cuidados. Los vacíos no se muestran.
8. **Opiniones de esta pieza** (si existen).
9. **Venta cruzada** («Combina y ahorra el envío»): 2 productos.
10. **Barra de compra fija** (solo móvil): precio, «Llega {fechas}» y botón. Aparece cuando el CTA principal sale de la pantalla (`IntersectionObserver`); no tapa el pie (`padding-bottom` en la página).

Mantener el JSON-LD `Product`; añadir `aggregateRating` solo con reseñas reales.

## 5. Checkout

1. **Cabecera mínima**: logo (vuelve a la ficha) y «Pago seguro» con candado. Sin menú, sin barra de anuncio, sin selector de idioma, sin pie de tienda.
2. **Pasos**: «1 Envío — 2 Pago».
3. **Resumen siempre visible**: foto, nombre, color, fecha de entrega, importe; cantidad con botones de 44 px; **barra de envío gratis** («Te faltan {importe} para el envío gratis» / «Tienes el envío gratis»).
4. **Formulario** en una columna, en este orden: email (con aclaración de uso), nombre, teléfono (con aclaración), **país** (antes que la dirección: fija el envío y el total cuanto antes), calle, piso (opcional), código postal + ciudad en una fila. Notas plegadas tras «Añadir nota o dedicatoria». Se elimina el campo provincia del formulario (la columna `region` queda nula).
   - `autocomplete` correcto en todos los campos, `inputmode="numeric"` en el postal, `type="email"`/`tel`.
   - Validación en el navegador al salir del campo, con mensaje junto al campo; el servidor sigue validando todo.
5. **Totales** y CTA «Ir al pago seguro · {total}». Debajo: «En el siguiente paso pagas en Stripe…».
6. Mientras se envía: botón desactivado con texto «Un momento…».

## 6. Fecha estimada de entrega

`src/lib/delivery.ts`:

```ts
estimateDelivery(leadTimeDays: number, country: string, from = new Date()): { min: Date; max: Date }
```

- `min = from + leadTimeDays + zone.transitDays[0]`, `max = from + leadTimeDays + zone.transitDays[1]`.
- Añadir `transitDays: [min, max]` a cada zona de `shipping.zones` en `config.ts` (valores iniciales: ES `[2, 3]`, AD `[3, 5]`, UE `[4, 7]`; el dueño los ajusta).
- Sin país conocido (ficha) se usa la primera zona. En el checkout se recalcula al cambiar el país.
- Formato con `Intl.DateTimeFormat(locale, { day: "numeric", month: "long" })`; si ambos caen en el mismo mes, «entre el 24 y el 29 de noviembre».
- La ficha es estática (ISR): la fecha se calcula **en el cliente** tras hidratar para que no quede obsoleta, reservando el alto de la caja.

## 7. Cambios en datos

Migración `supabase/migrations/0002_conversion.sql` (y reflejarla en `schema.sql`):

```sql
alter table public.products
  add column if not exists colors jsonb not null default '[]',   -- [{"id":"coral","hex":"#FF5C6C","name":{"es":"Coral","ca":"Coral","en":"Coral","fr":"Corail"}}]
  add column if not exists details jsonb not null default '{}',  -- medidas y materiales, por idioma
  add column if not exists care jsonb not null default '{}';     -- cuidados, por idioma

alter table public.order_items add column if not exists color text;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  author text not null,
  city text,
  rating smallint not null check (rating between 1 and 5),
  body text not null,
  locale text not null default 'es',
  photo_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "Reseñas publicadas visibles" on public.reviews
  for select to anon, authenticated using (published);
```

- Las reseñas las introduce el dueño en el back office a partir de opiniones reales de clientes. Se muestran en el idioma en que se escribieron.
- Back office: campos nuevos en el formulario de producto (colores, medidas y materiales, cuidados) y sección «Reseñas» (alta, edición, publicar/ocultar, foto).
- El pedido muestra el color elegido en la lista y en el detalle.

## 8. Medición y rendimiento

- `src/lib/analytics.ts` con `track(event, props)` que no hace nada si no hay proveedor configurado. Eventos: `view_item`, `select_color`, `begin_checkout`, `checkout_error`, `purchase` (en la página de gracias, una sola vez por pedido).
- Objetivos en móvil (Lighthouse): LCP < 2,5 s, CLS < 0,1, accesibilidad ≥ 95.
- La imagen del hero y la primera de la galería con `priority`; el resto con carga diferida. Vídeos con `preload="metadata"` y `poster`.
- Fuentes autoalojadas (ya lo están con `@fontsource-variable`); cargar solo los pesos usados.

## 9. Contenido pendiente del dueño

| Material | Dónde se usa | Especificación |
| --- | --- | --- |
| Nombre de marca, email, Instagram | `config.ts` | Sustituye a «Punto Alegre» |
| Fotos de producto (5 por pieza) | Ficha, tarjetas | Cuadradas, 1600 px, luz natural, fondo liso: frontal, detalle del punto, en la mano (escala), en uso, envuelta para regalo |
| Vídeo por pieza | Hero y galería | 6–10 s, vertical o cuadrado, sin sonido, la pieza girando en la mano, < 4 MB |
| Foto de quien teje | Landing | 4:5, con las manos en la labor |
| Texto «Quién teje» | Landing | Nombre, ciudad y dos frases propias, en 4 idiomas |
| Reseñas reales (mínimo 3) | Landing y ficha | Texto, nombre, ciudad y, si se puede, foto del cliente con permiso |
| Medidas, materiales y cuidados | Ficha | Por producto |
| Colores disponibles | Ficha | Por producto: nombre y tono |
| Política de devoluciones para piezas por encargo, aviso legal y privacidad | Preguntas, ficha, pie | Revisadas por un asesor |
| Garantía («si llega con un defecto, la rehacemos») | Ficha | Solo si se va a cumplir |
| Tarifas y plazos de envío reales | `config.ts` | Por zona |
