create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  age int,
  height_cm int,
  weight_kg numeric(5,1),
  sex text check (sex in ('male','female')),
  activity_factor numeric(3,3),
  updated_at timestamptz default now()
);

create table if not exists public.calorie_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  calories int not null,
  calculated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.calorie_calculations enable row level security;

create policy "read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "read own calories"
  on public.calorie_calculations for select
  using (user_id = auth.uid());

create policy "insert own calories"
  on public.calorie_calculations for insert
  with check (user_id = auth.uid());

create policy "delete own calories"
  on public.calorie_calculations for delete
  using (user_id = auth.uid());