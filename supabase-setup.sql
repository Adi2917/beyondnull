-- BeyondNull Supabase setup
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- This creates the tables currently used by the React admin panel.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  pin text not null,
  role text not null default 'Admin',
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  address text,
  district text,
  package_amount text,
  services text[] not null default '{}',
  status text not null default 'Active',
  source text default 'Admin Panel',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.admins add column if not exists role text not null default 'Admin';
alter table public.clients add column if not exists status text not null default 'Active';
alter table public.clients add column if not exists source text default 'Admin Panel';
alter table public.clients add column if not exists notes text;

insert into public.admins (phone, pin, role)
values
  ('7485875137', '112233', 'Founder Admin'),
  ('6205475866', '112233', 'Operations Admin')
on conflict (phone)
do update set
  pin = excluded.pin,
  role = excluded.role;

-- Current frontend reads/writes directly with the Supabase anon key.
-- Keep RLS disabled for this version, otherwise the admin panel will need
-- Supabase Auth and proper policies before data can be read/written.
alter table public.admins disable row level security;
alter table public.clients disable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.admins to anon, authenticated;
grant select, insert, update, delete on public.clients to anon, authenticated;

-- Verify admins were created.
select phone from public.admins order by phone;
