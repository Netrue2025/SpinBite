create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  preferred_country text not null default 'Nigeria' check (
    preferred_country in ('Nigeria', 'United Kingdom', 'Brazil', 'United States', 'India', 'Ghana', 'Other')
  ),
  created_at timestamptz not null default now()
);

create table if not exists public.meals (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text not null,
  country text not null check (country in ('Nigeria', 'United Kingdom', 'Brazil', 'United States', 'India', 'Ghana', 'Other')),
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner')),
  image_url text not null,
  video_url text not null,
  ingredients text[] not null default '{}',
  cooking_steps text[] not null default '{}',
  cooking_time text not null,
  difficulty text not null default 'Easy' check (difficulty in ('Easy', 'Medium', 'Bold')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.meal_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  meal_id text not null references public.meals(id) on delete cascade,
  rating text not null check (rating in ('loved', 'good', 'okay', 'not_for_me')),
  created_at timestamptz not null default now(),
  unique (user_id, meal_id)
);

create table if not exists public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  meal_id text not null references public.meals(id) on delete cascade,
  date date not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner')),
  created_at timestamptz not null default now(),
  unique (user_id, date, meal_type)
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role, preferred_country)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'user',
    'Nigeria'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.meals enable row level security;
alter table public.meal_ratings enable row level security;
alter table public.meal_plans enable row level security;

drop policy if exists "Users can read their own profile" on public.users;
create policy "Users can read their own profile"
on public.users for select
using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile"
on public.users for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "Authenticated users can read meals" on public.meals;
create policy "Authenticated users can read meals"
on public.meals for select
to authenticated
using (true);

drop policy if exists "Admins can write meals" on public.meals;
create policy "Admins can write meals"
on public.meals for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users manage own ratings" on public.meal_ratings;
create policy "Users manage own ratings"
on public.meal_ratings for all
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users manage own plans" on public.meal_plans;
create policy "Users manage own plans"
on public.meal_plans for all
to authenticated
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

insert into storage.buckets (id, name, public)
values ('meal-images', 'meal-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Admins upload meal images" on storage.objects;
create policy "Admins upload meal images"
on storage.objects for all
to authenticated
using (bucket_id = 'meal-images' and public.is_admin())
with check (bucket_id = 'meal-images' and public.is_admin());

drop policy if exists "Public reads meal images" on storage.objects;
create policy "Public reads meal images"
on storage.objects for select
using (bucket_id = 'meal-images');
