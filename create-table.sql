-- สร้างตาราง (ถ้ายังไม่มี)
create table if not exists public.temples (
  id uuid primary key default gen_random_uuid(),
  temple_id text unique not null,
  name text not null,
  location text,
  description text,
  image text,
  -- SEO/SMO fields
  seo_title text,
  seo_description text,
  seo_keywords text[],
  smo_title text,
  smo_description text,
  seo_image text,
  created_at timestamptz default now()
);

create table if not exists public.fortunes (
  id uuid primary key default gen_random_uuid(),
  temple_id text not null references public.temples(temple_id) on delete cascade,
  fortune_number int not null,
  title text not null,
  content text not null,
  meaning text,
  advice text,
  -- SEO/SMO fields
  seo_title text,
  seo_description text,
  seo_keywords text[],
  smo_title text,
  smo_description text,
  seo_image text,
  unique (temple_id, fortune_number),
  created_at timestamptz default now()
);

create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  temple_id text not null,
  temple_name text,
  fortune_number int not null,
  fortune_title text,
  fortune_content text,
  user_agent text,
  ip text,
  created_at timestamptz default now()
);

-- เปิด RLS
alter table public.draws enable row level security;
alter table public.temples enable row level security;
alter table public.fortunes enable row level security;

-- นโยบาย (กันซ้ำด้วย block)
do $$
begin
  create policy "anon_insert_draws" on public.draws
    for insert to anon
    with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "public_read_temples" on public.temples
    for select to anon
    using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_insert_temples" on public.temples
    for insert to anon
    with check (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "public_read_fortunes" on public.fortunes
    for select to anon
    using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "anon_insert_fortunes" on public.fortunes
    for insert to anon
    with check (true);
exception when duplicate_object then null;
end $$;