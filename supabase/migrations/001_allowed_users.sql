-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists public.allowed_users (
  telegram_id  text        primary key,
  phone        text,
  username     text,
  role         text        not null default 'user' check (role in ('user', 'admin')),
  added_by     text        not null,
  added_at     timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.allowed_users enable row level security;

-- Only service_role (server-side) can read/write — anon users see nothing
create policy "service only" on public.allowed_users
  for all
  to service_role
  using (true)
  with check (true);
