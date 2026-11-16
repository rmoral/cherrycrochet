-- Esquema de la tienda de crochet. Ejecutar una vez en Supabase (SQL Editor).

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name jsonb not null default '{}',          -- {"es": "...", "ca": "...", "en": "...", "fr": "..."}
  tagline jsonb not null default '{}',
  description jsonb not null default '{}',
  price_cents integer not null check (price_cents > 0),
  compare_at_cents integer,
  media jsonb not null default '[]',         -- [{"type": "image" | "video", "url": "..."}]
  lead_time_days integer not null default 10,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity (start with 1001) unique,
  status text not null default 'pending'
    check (status in ('pending','paid','in_production','shipped','delivered','cancelled')),
  locale text not null default 'es',
  customer_name text not null,
  email text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text,
  postal_code text not null,
  country text not null,
  notes text,
  subtotal_cents integer not null,
  shipping_cents integer not null,
  total_cents integer not null,
  stripe_session_id text unique,
  stripe_payment_intent text,
  tracking_number text,
  tracking_url text,
  admin_notes text,
  paid_at timestamptz,
  shipped_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_cents integer not null,
  quantity integer not null check (quantity > 0)
);

create index if not exists orders_status_idx on public.orders (status, created_at desc);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- Seguridad: el público solo puede LEER productos activos.
-- Pedidos y escrituras pasan siempre por el servidor (service role).
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Productos activos visibles" on public.products;
create policy "Productos activos visibles" on public.products
  for select to anon, authenticated using (active);

-- Almacén público para fotos y vídeos de producto (subida solo desde el back office).
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;
