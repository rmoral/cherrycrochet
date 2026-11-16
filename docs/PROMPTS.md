# Prompts para Claude Code

Úsalos en orden, **uno por sesión o por commit**. Cada uno es autosuficiente: Claude Code lee
`CLAUDE.md` solo y el prompt le indica qué más leer. No pases al siguiente hasta que el anterior
cumpla sus criterios.

Antes de empezar: descomprime el proyecto, `git init && git add -A && git commit -m "Base"` y abre
Claude Code en la carpeta.

---

## 0 · Orientación (sin cambios)

```
Lee CLAUDE.md, README.md, docs/design/DESIGN.md y los cuatro archivos de docs/design/reference/.
Después recorre src/ para entender cómo está construida la tienda.

No modifiques nada. Ejecuta npm install, npm run build, npx eslint src y npx tsc --noEmit y dime:
1. Si todo pasa en verde.
2. Un resumen de 10 líneas de la arquitectura tal como la entiendes.
3. Cualquier contradicción entre DESIGN.md y el código actual que debamos resolver antes de empezar.
4. Riesgos que veas en el flujo de pago (src/app/actions/checkout.ts, src/lib/stripe.ts y el webhook).
```

Criterio: build en verde y ninguna contradicción sin resolver.

---

## 1 · Sistema visual y componentes base

```
Implementa la sección 2 de docs/design/DESIGN.md ("Sistema visual").

1. Añade a @theme en src/app/globals.css los tokens nuevos (coral-deep, sun-deep, mint-soft,
   mint-deep, line, muted, field) con los hex de la tabla.
2. Crea en src/components/ui/ los componentes Button, Icon, Badge, Stars, PhotoFrame y Accordion
   descritos en "Componentes base". Los valores exactos (tamaños, radios, sombras) están en los
   estilos en línea de docs/design/reference/*.dc.html.
3. Corrige el contraste en todo el sitio: el botón primario pasa a texto tinta sobre coral, y todo
   texto que hoy usa text-coral (precios, errores) pasa a coral-deep.
4. Sustituye todos los emoji usados como iconos (cabecera, pie, pasos, ficha, checkout, página de
   gracias, back office) por el componente Icon.

No cambies todavía la estructura de las páginas. Al terminar: build, lint y tipos en verde, y
enséñame una lista de los archivos tocados.
```

Criterio: no queda ningún emoji ni texto blanco sobre coral; la tienda se ve igual salvo colores e iconos.

---

## 2 · Datos: colores, textos de ficha y reseñas

```
Implementa la sección 7 de docs/design/DESIGN.md ("Cambios en datos") y la función de la sección 6.

1. Crea supabase/migrations/0002_conversion.sql con el SQL indicado y refléjalo en
   supabase/schema.sql. NO lo apliques a ningún proyecto Supabase.
2. Actualiza src/lib/types.ts (Product: colors, details, care; OrderItem: color; nuevo tipo Review)
   y src/lib/demo.ts (dos productos de muestra con colores; ninguna reseña de muestra).
3. Añade a src/lib/data.ts getReviews(productId?) que devuelve solo reseñas publicadas, y [] en
   modo demo.
4. Añade transitDays a cada zona de shipping.zones en src/lib/config.ts y crea src/lib/delivery.ts
   con estimateDelivery y una función de formato del rango de fechas por idioma. Incluye pruebas
   unitarias de estimateDelivery con node:test (cambio de mes y de año incluidos).
5. Back office: en el formulario de producto, editor de colores (nombre en 4 idiomas + tono) y
   campos "Medidas y materiales" y "Cuidados" por idioma. Nueva sección /admin/reviews para crear,
   editar, publicar/ocultar y borrar reseñas, con foto subida al bucket product-media igual que
   las fotos de producto. Todas las acciones empiezan con requireAdmin().
6. El color elegido se guarda en order_items.color y se ve en la lista y el detalle de pedidos.

Todavía no cambies las páginas públicas. Al terminar: build, lint, tipos y pruebas en verde.
```

Criterio: el back office permite gestionar colores y reseñas; las pruebas de fechas pasan.

---

## 3 · Landing

```
Rehaz src/app/[locale]/page.tsx siguiendo la sección 3 de docs/design/DESIGN.md y las referencias
docs/design/reference/Main.dc.html (escritorio) y LandingMovil.dc.html (móvil, 390 px).

Reglas:
- Empieza por móvil. El CTA del hero debe verse sin scroll en 390 × 844.
- Un solo CTA primario, repetido. Elimina el botón secundario del hero.
- Todos los textos nuevos van a src/lib/i18n.ts en es, ca, en y fr. Traduce con naturalidad, no
  palabra por palabra.
- La línea de datos del hero, los tiempos de "Cómo funciona" y las tarifas de las preguntas se
  calculan de los productos y de config.ts, no se escriben a mano.
- Opiniones y nota media solo se renderizan si getReviews() devuelve reseñas. "Quién teje" solo si
  sus textos no están vacíos. Nunca publiques los huecos entre corchetes de la referencia.
- Barra de anuncio y cabecera según la referencia (en móvil: logo + botón "Tienda").
- Mantén el JSON-LD FAQPage, los metadatos, hreflang y revalidate.
- Usa los componentes de src/components/ui/.

Al terminar: build, lint y tipos en verde. Arranca npm run dev en modo demo y descríbeme cómo se ve
a 390 px y a 1280 px, sección por sección, y qué secciones quedan ocultas por falta de contenido.
```

Criterio: en modo demo se ven hero, franja, productos, cómo funciona, preguntas y CTA final; opiniones y «quién teje» ocultas.

---

## 4 · Ficha de producto

```
Rehaz src/app/[locale]/p/[slug]/page.tsx y src/components/Gallery.tsx siguiendo la sección 4 de
docs/design/DESIGN.md y la referencia docs/design/reference/Ficha.dc.html.

- Galería deslizable con scroll-snap, vídeo primero si existe, contador y miniaturas.
- Caja de fecha de entrega con estimateDelivery, calculada en el cliente tras hidratar y con el
  alto reservado para no provocar saltos.
- Selector de color (solo si el producto tiene colores) que pasa ?color=<id> al checkout.
- CTA "Comprar ahora · {precio}" y barra de compra fija en móvil que aparece cuando el CTA
  principal sale de pantalla (IntersectionObserver) y no tapa el pie.
- Acordeones: descripción, medidas y materiales, envío y devoluciones, cuidados. Ocultar vacíos.
- Opiniones de la pieza (si existen) y venta cruzada de 2 productos.
- En escritorio: dos columnas, con la columna de compra fija al hacer scroll.
- Mantén el JSON-LD Product; añade aggregateRating solo con reseñas reales.
- Textos nuevos en los 4 idiomas.

La página debe seguir siendo estática con ISR: nada de cookies ni searchParams en el servidor.
Al terminar: build (comprueba que /[locale]/p/[slug] sigue saliendo como SSG), lint y tipos en verde.
```

Criterio: la ficha sigue prerenderizada; el color llega al checkout; la barra fija no tapa contenido.

---

## 5 · Checkout

```
Rehaz src/app/[locale]/checkout/[slug]/page.tsx, src/components/CheckoutForm.tsx y ajusta
src/app/actions/checkout.ts siguiendo la sección 5 de docs/design/DESIGN.md y la referencia
docs/design/reference/Checkout.dc.html.

- Las rutas de checkout y success usan una cabecera mínima (logo + "Pago seguro"), sin barra de
  anuncio, navegación, selector de idioma ni pie de tienda. Resuélvelo con un route group con su
  propio layout dentro de [locale].
- Indicador de pasos, resumen con foto, color, fecha de entrega (recalculada al cambiar de país),
  cantidad y barra de envío gratis.
- Orden de campos: email, nombre, teléfono, país, calle, piso, código postal + ciudad. Notas
  plegadas. Quita el campo provincia.
- Validación al salir de cada campo con mensaje junto al campo (aria-describedby, aria-invalid).
- Botón "Ir al pago seguro · {total}" y estado de envío.
- En el servidor: valida que el color recibido existe en el producto, guárdalo en order_items.color
  y añádelo al nombre del artículo en Stripe ("Pulpo amigurumi · Coral"). El precio y el envío se
  siguen calculando solo en el servidor.

No cambies la lógica de creación de la sesión de Stripe más allá de lo indicado. Al terminar:
build, lint y tipos en verde, y explícame cómo probar el flujo completo con Stripe en modo test.
```

Criterio: con claves de test, un pedido con color llega al back office como pagado y con el color visible.

---

## 6 · Páginas legales y medición

```
1. Crea las páginas /[locale]/envios-y-devoluciones, /[locale]/aviso-legal y /[locale]/privacidad
   con el texto en src/lib/i18n.ts (deja el contenido como huecos claramente marcados y márcalas
   noindex hasta que tengan texto real). Enlázalas desde el pie y desde el acordeón de envíos.
2. Implementa la sección 8 de docs/design/DESIGN.md: src/lib/analytics.ts con track() y los eventos
   view_item, select_color, begin_checkout, checkout_error y purchase (este último una sola vez por
   pedido). Sin proveedor configurado no debe cargar ningún script ni escribir cookies.
3. Pasada de rendimiento y accesibilidad: priority solo en la imagen LCP de cada página, poster y
   preload="metadata" en vídeos, foco visible en todos los controles, orden de tabulación lógico,
   textos alternativos. Dime qué has encontrado y corregido.

Al terminar: build, lint y tipos en verde.
```

Criterio: sin proveedor de analítica no hay peticiones a terceros.

---

## 7 · Emails al cliente (opcional)

```
Añade emails transaccionales con Resend (variable RESEND_API_KEY; sin ella, no se envía nada y no
falla): confirmación al pasar el pedido a pagado y aviso de envío cuando el administrador lo marca
como enviado, con el enlace de seguimiento. En el idioma del pedido (orders.locale), con la fecha
estimada de entrega. El envío de la confirmación debe ser idempotente aunque el webhook y la página
de gracias se ejecuten a la vez. Plantillas en HTML sencillo con los colores de la marca.
```

---

## 8 · Puesta en producción

```
Prepara el despliegue sin ejecutarlo:
1. Revisa README.md y actualízalo con todo lo añadido (migraciones, reseñas, analítica, emails).
2. Escribe docs/CHECKLIST-LANZAMIENTO.md: variables de entorno, pasos en Supabase (ejecutar
   schema.sql o las migraciones, crear el usuario administrador, desactivar el registro público),
   pasos en Stripe (webhook con sus 4 eventos, activar Apple Pay y Google Pay, recibos por email),
   dominio, y una prueba de compra de principio a fin en modo test con sus resultados esperados.
3. Haz una revisión de seguridad del código: uso de la service role, validación de entradas en las
   acciones de servidor, verificación de firma del webhook, políticas RLS. Enumera hallazgos por
   gravedad; corrige solo los claros y pregúntame por el resto.
```

---

## Prompt de corrección (reutilizable)

```
En [página], a [390 px / 1280 px], veo esto: [descripción o captura].
Según docs/design/DESIGN.md sección [n] debería ser: [lo esperado].
Corrige solo eso, sin tocar nada más, y dime qué archivo y líneas has cambiado.
```
