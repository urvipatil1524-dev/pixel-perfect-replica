create table if not exists public.requests (
  id text primary key,
  kind text not null check (kind in ('Complaint', 'Pickup')),
  type text not null check (char_length(type) between 2 and 80),
  location text not null check (char_length(location) between 3 and 300),
  contact_name text check (contact_name is null or char_length(contact_name) <= 120),
  contact_phone text check (contact_phone is null or char_length(contact_phone) <= 24),
  description text check (description is null or char_length(description) <= 1000),
  preferred_date date,
  date date not null default current_date,
  status text not null default 'Submitted' check (status in ('Submitted', 'Assigned', 'In Progress', 'Resolved')),
  collector text,
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;
revoke all on table public.requests from anon, authenticated;
grant all on table public.requests to service_role;
