-- 0002 · Rediseño orientado a conversión (docs/design/DESIGN.md §7)
-- Colores, medidas/materiales y cuidados por producto; color en la línea de pedido; reseñas reales.
-- Idempotente: se puede ejecutar más de una vez.

alter table public.products
  add column if not exists colors jsonb not null default '[]',   -- [{"id":"coral","hex":"#FF5C6C","name":{"es":"Coral","ca":"Coral","en":"Coral","fr":"Corail"}}]
  add column if not exists details jsonb not null default '{}',  -- medidas y materiales, por idioma
  add column if not exists care jsonb not null default '{}';     -- cuidados, por idioma

alter table public.order_items add column if not exists color text;  -- nombre del color en español en el momento de la compra

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

create index if not exists reviews_published_idx on public.reviews (published, product_id, created_at desc);

-- Seguridad: el público solo lee reseñas publicadas. Las escrituras pasan por el servidor (service role).
alter table public.reviews enable row level security;
drop policy if exists "Reseñas publicadas visibles" on public.reviews;
create policy "Reseñas publicadas visibles" on public.reviews
  for select to anon, authenticated using (published);
