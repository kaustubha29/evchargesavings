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

-- Fast deduplication lookups by email
create index if not exists leads_email_idx on leads (lower(email));

-- Fast filtering by state/zip for routing leads to electricians
create index if not exists leads_state_idx on leads (state_code);
create index if not exists leads_zip_idx   on leads (zip);

-- Row-level security: only service role can access (no public reads/writes)
alter table leads enable row level security;
