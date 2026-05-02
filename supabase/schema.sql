-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists leads (
  id           uuid        default gen_random_uuid() primary key,
  email        text        not null,
  zip          text,
  state_code   text,
  source_page  text        not null default '/',
  created_at   timestamptz default now(),
  contacted_at timestamptz
);

-- Unique constraint handles deduplication at the database level
create unique index if not exists leads_email_unique on leads (lower(email));

-- Fast filtering by state/zip for routing leads to electricians
create index if not exists leads_state_idx on leads (state_code);
create index if not exists leads_zip_idx   on leads (zip);

-- No RLS needed — this table is only accessed via the service_role key
-- from the server-side API route, never from the browser directly.

-- Installers table for routing leads
create table if not exists installers (
  id           uuid        default gen_random_uuid() primary key,
  name         text        not null,
  email        text        not null,
  phone        text,
  state_code   text        not null,
  city         text,
  service_area text,
  rating       float       default 4.5,
  reviews      int         default 0,
  active       boolean     default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists installers_state_idx on installers (state_code, active);
create index if not exists installers_email_idx on installers (email);

-- Track lead → installer assignments
create table if not exists lead_assignments (
  id           uuid        default gen_random_uuid() primary key,
  lead_id      uuid        not null references leads(id),
  installer_id uuid        not null references installers(id),
  assigned_at  timestamptz default now(),
  contacted_at timestamptz,
  responded_at timestamptz
);
