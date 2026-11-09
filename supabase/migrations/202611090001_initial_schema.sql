create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('specialist', 'patient')),
  created_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles (id) on delete restrict,
  full_name text not null check (char_length(btrim(full_name)) between 1 and 120),
  age integer check (age is null or age between 0 and 130),
  city text check (city is null or char_length(city) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists patients_created_by_created_at_idx
  on public.patients (created_by, created_at desc);

alter table public.profiles enable row level security;
alter table public.patients enable row level security;

-- Una cuenta autenticada solo puede consultar su propio perfil.
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

-- Solo especialistas pueden gestionar los registros que ellos mismos crearon.
drop policy if exists "Specialists can read their patients" on public.patients;
create policy "Specialists can read their patients"
  on public.patients for select
  to authenticated
  using (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'specialist'
    )
  );

drop policy if exists "Specialists can create their patients" on public.patients;
create policy "Specialists can create their patients"
  on public.patients for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'specialist'
    )
  );

drop policy if exists "Specialists can update their patients" on public.patients;
create policy "Specialists can update their patients"
  on public.patients for update
  to authenticated
  using (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'specialist'
    )
  )
  with check (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'specialist'
    )
  );

drop policy if exists "Specialists can delete their patients" on public.patients;
create policy "Specialists can delete their patients"
  on public.patients for delete
  to authenticated
  using (
    created_by = (select auth.uid())
    and exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'specialist'
    )
  );

grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.patients to authenticated;
