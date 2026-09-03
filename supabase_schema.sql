-- ============================================================
-- HARMONIA — schemat bazy danych dla Supabase
-- Wklej całość w: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- 1) PROFILE (rola użytkownika: client / admin)
-- Supabase Auth tworzy użytkowników w auth.users — my dokładamy tabelę
-- z rolą, bo auth.users nie ma pola "role".
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz default now()
);

-- Automatycznie twórz wiersz w profiles przy każdej nowej rejestracji
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'client');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) REZERWACJE
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  client_name text not null,
  client_email text not null,
  client_phone text,
  service text not null,
  form text not null check (form in ('Stacjonarnie', 'Na odległość')),
  date date not null,
  time text not null,
  status text not null default 'oczekuje' check (status in ('oczekuje', 'potwierdzona', 'odwołana')),
  created_at timestamptz default now()
);

-- 3) ZABLOKOWANE TERMINY (urlopy, niedostępność terapeutki)
create table if not exists blocked_slots (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  time text not null,
  unique (date, time)
);

-- ============================================================
-- ROW LEVEL SECURITY — kto co widzi i może zapisywać
-- ============================================================
alter table profiles enable row level security;
alter table bookings enable row level security;
alter table blocked_slots enable row level security;

-- profiles: każdy widzi tylko siebie; admin widzi wszystkich
create policy "użytkownik widzi własny profil" on profiles
  for select using (auth.uid() = id);

-- Funkcja pomocnicza SECURITY DEFINER — sprawdza rolę OMIJAJĄC RLS.
-- Bez tego reguła "admin widzi wszystkie profile" odpytywałaby samą
-- tabelę profiles w swojej własnej regule, co daje nieskończoną rekurencję.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "admin widzi wszystkie profile" on profiles
  for select using (public.is_admin());

-- bookings: każdy (nawet niezalogowany) może DODAĆ rezerwację (formularz publiczny)
create policy "każdy może dodać rezerwację" on bookings
  for insert with check (true);

-- bookings: podgląd i edycja — tylko admin (klient nie czyta cudzych rezerwacji;
-- do sprawdzania zajętości terminów służy funkcja get_taken_slots() poniżej)
create policy "admin widzi wszystkie rezerwacje" on bookings
  for select using (public.is_admin());

create policy "admin edytuje rezerwacje" on bookings
  for update using (public.is_admin());

-- blocked_slots: każdy zalogowany i niezalogowany może ODCZYTAĆ (żeby kalendarz rezerwacji wiedział, co jest zajęte)
create policy "każdy widzi zablokowane terminy" on blocked_slots
  for select using (true);

create policy "admin zarządza blokadami" on blocked_slots
  for all using (public.is_admin());

-- każdy (nawet niezalogowany) może sprawdzić, które terminy są zajęte —
-- ale bez dostępu do danych osobowych klientów (imię, e-mail, telefon).
-- To bezpieczna "furtka" w RLS: funkcja SECURITY DEFINER zwraca tylko
-- kolumny potrzebne do pokazania kalendarza rezerwacji.
create or replace function public.get_taken_slots()
returns table(date date, "time" text, status text)
language sql
security definer
set search_path = public
as $$
  select date, time, status from bookings where status <> 'odwołana';
$$;

grant execute on function public.get_taken_slots() to anon, authenticated;

-- ============================================================
-- (OPCJONALNIE) DANE DEMO — odkomentuj, jeśli chcesz mieć przykładowe
-- rezerwacje do testowania panelu admina od razu po wdrożeniu.
-- ============================================================
-- insert into bookings (client_name, client_email, client_phone, service, form, date, time, status) values
--   ('Kasia Nowak', 'kasia.nowak@mail.com', '600100200', 'Harmonizacja Czakr', 'Stacjonarnie', current_date, '15:00', 'potwierdzona'),
--   ('Marek Zych', 'marek.zych@mail.com', '600200300', 'Oczyszczanie Aury', 'Na odległość', current_date, '17:00', 'oczekuje');

-- ============================================================
-- PIERWSZE KONTO TERAPEUTKI
-- Zarejestruj się normalnie przez formularz logowania na stronie
-- (tryb "Załóż konto"), a potem odpal to zapytanie, podmieniając e-mail:
-- ============================================================
-- update profiles set role = 'admin' where email = 'anna@harmonia.pl';
