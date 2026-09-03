-- ============================================================
-- POPRAWKA: infinite recursion detected in policy for relation "profiles"
-- Wklej to w SQL Editor i kliknij Run.
-- ============================================================

-- Funkcja pomocnicza, która sprawdza rolę OMIJAJĄC RLS (SECURITY DEFINER),
-- dzięki czemu reguły na profiles/bookings/blocked_slots nie odpytują
-- same siebie w kółko.
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

-- Usuń stare, wadliwe reguły
drop policy if exists "admin widzi wszystkie profile" on profiles;
drop policy if exists "admin widzi wszystkie rezerwacje" on bookings;
drop policy if exists "admin edytuje rezerwacje" on bookings;
drop policy if exists "admin zarządza blokadami" on blocked_slots;

-- Odtwórz je poprawnie, korzystając z funkcji is_admin()
create policy "admin widzi wszystkie profile" on profiles
  for select using (public.is_admin());

create policy "admin widzi wszystkie rezerwacje" on bookings
  for select using (public.is_admin());

create policy "admin edytuje rezerwacje" on bookings
  for update using (public.is_admin());

create policy "admin zarządza blokadami" on blocked_slots
  for all using (public.is_admin());
