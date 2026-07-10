-- BeyondNull Supabase setup
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- This creates the tables currently used by the React admin panel.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null default 'beyoondnull@gmail.com',
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

create table if not exists public.admin_pin_resets (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text not null,
  otp text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.admins add column if not exists email text not null default 'beyoondnull@gmail.com';
alter table public.admins add column if not exists role text not null default 'Admin';
alter table public.clients add column if not exists status text not null default 'Active';
alter table public.clients add column if not exists source text default 'Admin Panel';
alter table public.clients add column if not exists notes text;

insert into public.admins (email, phone, pin, role)
values
  ('beyoondnull@gmail.com', '7485875137', '112233', 'Founder Admin'),
  ('beyoondnull@gmail.com', '6205475866', '112233', 'Operations Admin')
on conflict (phone)
do update set
  email = excluded.email,
  pin = excluded.pin,
  role = excluded.role;

-- Current frontend reads/writes directly with the Supabase anon key.
-- Keep RLS disabled for this version, otherwise the admin panel will need
-- Supabase Auth and proper policies before data can be read/written.
alter table public.admins disable row level security;
alter table public.clients disable row level security;
alter table public.admin_pin_resets disable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.clients to anon, authenticated;

revoke all on public.admins from anon, authenticated;
revoke all on public.admin_pin_resets from anon, authenticated;

drop function if exists public.verify_admin_login(text, text);
drop function if exists public.request_admin_pin_reset(text, text);
drop function if exists public.confirm_admin_pin_reset(text, text, text, text);

create or replace function public.verify_admin_login(
  admin_email text,
  admin_pin text
)
returns table (
  email text,
  phone text,
  role text
)
language sql
security definer
set search_path = public
as $$
  select admins.email, admins.phone, admins.role
  from public.admins
  where lower(admins.email) = lower(admin_email)
    and admins.pin = admin_pin
  limit 1;
$$;

create or replace function public.request_admin_pin_reset(
  admin_email text,
  admin_phone text
)
returns table (
  otp text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_otp text;
  expiry timestamptz;
begin
  if not exists (
    select 1
    from public.admins
    where lower(admins.email) = lower(admin_email)
      and admins.phone = admin_phone
  ) then
    return;
  end if;

  generated_otp := lpad((floor(random() * 9000) + 1000)::int::text, 4, '0');
  expiry := now() + interval '5 minutes';

  insert into public.admin_pin_resets (email, phone, otp, expires_at)
  values (lower(admin_email), admin_phone, generated_otp, expiry);

  otp := generated_otp;
  expires_at := expiry;
  return next;
end;
$$;

create or replace function public.confirm_admin_pin_reset(
  admin_email text,
  admin_phone text,
  reset_otp text,
  new_pin text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  reset_id uuid;
begin
  select id
  into reset_id
  from public.admin_pin_resets
  where lower(email) = lower(admin_email)
    and phone = admin_phone
    and otp = reset_otp
    and used_at is null
    and expires_at > now()
  order by created_at desc
  limit 1;

  if reset_id is null then
    return false;
  end if;

  update public.admins
  set pin = new_pin
  where lower(email) = lower(admin_email)
    and phone = admin_phone;

  update public.admin_pin_resets
  set used_at = now()
  where id = reset_id;

  return true;
end;
$$;

grant execute on function public.verify_admin_login(text, text) to anon, authenticated;
grant execute on function public.request_admin_pin_reset(text, text) to anon, authenticated;
grant execute on function public.confirm_admin_pin_reset(text, text, text, text) to anon, authenticated;

-- Verify admins were created.
select email, phone from public.admins order by phone;
