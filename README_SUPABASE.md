# Podłączenie Supabase — instrukcja krok po kroku

## 1. Załóż projekt
1. Wejdź na https://supabase.com → **New project**.
2. Zapisz sobie hasło do bazy (nie będzie już nigdzie pokazane).
3. Poczekaj ok. 2 minuty, aż projekt się utworzy.

## 2. Uruchom schemat bazy
1. W panelu Supabase: **SQL Editor → New query**.
2. Wklej całą zawartość pliku `supabase_schema.sql` (jest w tym paczce) i kliknij **Run**.
3. To utworzy tabele `profiles`, `bookings`, `blocked_slots`, funkcję `get_taken_slots()` oraz reguły dostępu (RLS).

## 3. Pobierz klucze API
1. **Project Settings → API**.
2. Skopiuj **Project URL** oraz **anon public** key.

## 4. Uzupełnij zmienne środowiskowe
Lokalnie:
```
cp .env.example .env
```
i wklej tam swoje wartości.

Na Netlify (jeśli budujesz przez Netlify, a nie wrzucasz gotowego `dist`):
**Site settings → Environment variables** → dodaj `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`.

> Uwaga: jeśli wrzucasz na Netlify gotowy folder `dist` (drag & drop), zmienne muszą być ustawione **przed** wykonaniem `npm run build` lokalnie — bo Vite "wypieka" je na stałe do plików JS w trakcie builda.

## 5. Załóż pierwsze konto i nadaj rolę terapeutki
1. Wejdź na stronę → **Zaloguj się** → **Zarejestruj się** (dowolny e-mail/hasło, np. `anna@harmonia.pl`).
2. W Supabase: **Table Editor → profiles** → znajdź swój wiersz → zmień `role` z `client` na `admin`.
3. Wyloguj się i zaloguj ponownie na stronie — powinnaś trafić do panelu admina.

## 6. (Opcjonalnie) Wyłącz potwierdzanie e-maila na czas testów
Domyślnie Supabase może wymagać kliknięcia w link potwierdzający rejestrację.
Żeby tego uniknąć na etapie testów: **Authentication → Providers → Email** → wyłącz *Confirm email*.
Pamiętaj, by włączyć to z powrotem przed prawdziwym uruchomieniem strony dla klientów.

## Co się zmieniło w kodzie
- Rezerwacje (`bookings`) i blokady terminów (`blocked_slots`) żyją teraz w bazie Supabase, nie w pamięci przeglądarki — przetrwają odświeżenie strony i są wspólne dla wszystkich odwiedzających.
- Logowanie (`LoginPage.jsx`) korzysta z prawdziwego Supabase Auth (zakładka "Zaloguj się" / "Zarejestruj się").
- Rola (klient / terapeutka) jest trzymana w tabeli `profiles`, nie na sztywno w kodzie.
- Sprawdzanie zajętości terminów w kalendarzu rezerwacji korzysta z funkcji `get_taken_slots()`, która celowo **nie** ujawnia danych osobowych innych klientów niezalogowanym użytkownikom.
