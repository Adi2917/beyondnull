-- BeyondNull Supabase setup
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- This creates the tables currently used by the React admin panel.

create extension if not exists pgcrypto;

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null default 'beyoondnull@gmail.com',
  phone text not null unique,
  pin text not null default 'protected',
  pin_hash text,
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

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admins(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.admins add column if not exists email text not null default 'beyoondnull@gmail.com';
alter table public.admins add column if not exists pin_hash text;
alter table public.admins add column if not exists role text not null default 'Admin';
alter table public.clients add column if not exists status text not null default 'Active';
alter table public.clients add column if not exists source text default 'Admin Panel';
alter table public.clients add column if not exists notes text;

insert into public.admins (email, phone, pin, pin_hash, role)
values
  ('beyoondnull@gmail.com', '7485875137', 'protected', crypt('112233', gen_salt('bf')), 'Founder Admin'),
  ('beyoondnull@gmail.com', '6205475866', 'protected', crypt('112233', gen_salt('bf')), 'Operations Admin')
on conflict (phone)
do update set
  email = excluded.email,
  pin = 'protected',
  pin_hash = coalesce(public.admins.pin_hash, excluded.pin_hash),
  role = excluded.role;

alter table public.admins enable row level security;
alter table public.clients enable row level security;
alter table public.admin_pin_resets enable row level security;
alter table public.admin_sessions enable row level security;

grant usage on schema public to anon, authenticated;

revoke all on public.admins from anon, authenticated;
revoke all on public.admin_pin_resets from anon, authenticated;
revoke all on public.admin_sessions from anon, authenticated;
revoke all on public.clients from anon, authenticated;

drop function if exists public.verify_admin_login(text, text);
drop function if exists public.request_admin_pin_reset(text, text);
drop function if exists public.confirm_admin_pin_reset(text, text, text, text);
drop function if exists public.admin_get_clients();
drop function if exists public.admin_get_client(uuid);
drop function if exists public.admin_add_client(text, text, text, text, text, text, text[]);
drop function if exists public.admin_update_client(uuid, text, text, text, text, text, text, text[]);
drop function if exists public.admin_delete_client(uuid);
drop function if exists public.admin_get_clients(text);
drop function if exists public.admin_get_client(text, uuid);
drop function if exists public.admin_add_client(text, text, text, text, text, text, text, text[]);
drop function if exists public.admin_update_client(text, uuid, text, text, text, text, text, text, text[]);
drop function if exists public.admin_delete_client(text, uuid);
drop function if exists public.is_valid_admin_session(text);

create or replace function public.is_valid_admin_session(admin_session_token text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_sessions
    where token = admin_session_token
      and revoked_at is null
      and expires_at > now()
  );
$$;

create or replace function public.verify_admin_login(
  admin_email text,
  admin_pin text
)
returns table (
  email text,
  phone text,
  role text,
  session_token text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_admin public.admins%rowtype;
begin
  select *
  into matched_admin
  from public.admins
  where lower(admins.email) = lower(admin_email)
    and admins.pin_hash = crypt(admin_pin, admins.pin_hash)
    and admins.phone in ('7485875137', '6205475866')
  limit 1;

  if matched_admin.id is null then
    return;
  end if;

  session_token := encode(gen_random_bytes(32), 'hex');
  expires_at := now() + interval '12 hours';

  insert into public.admin_sessions (admin_id, token, expires_at)
  values (matched_admin.id, session_token, expires_at);

  email := matched_admin.email;
  phone := matched_admin.phone;
  role := matched_admin.role;
  return next;
end;
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
  set
    pin = 'protected',
    pin_hash = crypt(new_pin, gen_salt('bf'))
  where lower(email) = lower(admin_email)
    and phone = admin_phone;

  update public.admin_pin_resets
  set used_at = now()
  where id = reset_id;

  return true;
end;
$$;

grant execute on function public.verify_admin_login(text, text) to anon, authenticated;
revoke execute on function public.request_admin_pin_reset(text, text) from public, anon, authenticated;
revoke execute on function public.confirm_admin_pin_reset(text, text, text, text) from public, anon, authenticated;

create or replace function public.admin_get_clients()
returns setof public.clients
language sql
security definer
set search_path = public
as $$
  select *
  from public.clients
  where false;
$$;

create or replace function public.admin_get_clients(admin_session_token text)
returns setof public.clients
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_valid_admin_session(admin_session_token) then
    raise exception 'unauthorized admin session' using errcode = '28000';
  end if;

  return query
  select *
  from public.clients
  order by created_at desc;
end;
$$;

create or replace function public.admin_get_client(admin_session_token text, client_id uuid)
returns public.clients
language plpgsql
security definer
set search_path = public
as $$
declare
  client_record public.clients%rowtype;
begin
  if not public.is_valid_admin_session(admin_session_token) then
    raise exception 'unauthorized admin session' using errcode = '28000';
  end if;

  select *
  into client_record
  from public.clients
  where id = client_id
  limit 1;

  return client_record;
end;
$$;

create or replace function public.admin_add_client(
  admin_session_token text,
  client_name text,
  client_phone text,
  client_email text,
  client_address text,
  client_district text,
  client_package_amount text,
  client_services text[]
)
returns public.clients
language plpgsql
security definer
set search_path = public
as $$
declare
  client_record public.clients%rowtype;
begin
  if not public.is_valid_admin_session(admin_session_token) then
    raise exception 'unauthorized admin session' using errcode = '28000';
  end if;

  insert into public.clients (
    name,
    phone,
    email,
    address,
    district,
    package_amount,
    services,
    status,
    source
  )
  select
    client_name,
    client_phone,
    nullif(client_email, ''),
    nullif(client_address, ''),
    nullif(client_district, ''),
    nullif(client_package_amount, ''),
    coalesce(client_services, '{}'),
    'Active',
    'Admin Panel'
  returning * into client_record;

  return client_record;
end;
$$;

create or replace function public.admin_update_client(
  admin_session_token text,
  client_id uuid,
  client_name text,
  client_phone text,
  client_email text,
  client_address text,
  client_district text,
  client_package_amount text,
  client_services text[]
)
returns public.clients
language plpgsql
security definer
set search_path = public
as $$
declare
  client_record public.clients%rowtype;
begin
  if not public.is_valid_admin_session(admin_session_token) then
    raise exception 'unauthorized admin session' using errcode = '28000';
  end if;

  update public.clients
  set
    name = client_name,
    phone = client_phone,
    email = nullif(client_email, ''),
    address = nullif(client_address, ''),
    district = nullif(client_district, ''),
    package_amount = nullif(client_package_amount, ''),
    services = coalesce(client_services, services)
  where id = client_id
  returning * into client_record;

  return client_record;
end;
$$;

create or replace function public.admin_delete_client(admin_session_token text, client_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_valid_admin_session(admin_session_token) then
    return false;
  end if;

  delete from public.clients
  where id = client_id;

  return true;
end;
$$;

grant execute on function public.admin_get_clients(text) to anon, authenticated;
grant execute on function public.admin_get_client(text, uuid) to anon, authenticated;
grant execute on function public.admin_add_client(text, text, text, text, text, text, text, text[]) to anon, authenticated;
grant execute on function public.admin_update_client(text, uuid, text, text, text, text, text, text, text[]) to anon, authenticated;
grant execute on function public.admin_delete_client(text, uuid) to anon, authenticated;
revoke execute on function public.admin_get_clients() from public, anon, authenticated;

-- Verify admins were created.
select email, phone from public.admins order by phone;
