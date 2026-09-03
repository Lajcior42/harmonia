# E-maile o rezerwacjach — instrukcja

Wysyłamy maile przez **Resend** (darmowy plan: 3000 maili/mies.) wywoływane
z Supabase Edge Function `send-booking-email`.

## 1. Załóż konto na Resend
1. Wejdź na https://resend.com → **Sign up** (darmowe konto).
2. **API Keys → Create API Key** → skopiuj klucz (zaczyna się od `re_...`).
3. Na start możesz wysyłać z domyślnego adresu `onboarding@resend.dev` (bez
   własnej domeny) — wystarczy do testów i małego ruchu. Docelowo warto
   dodać własną domenę w Resend (**Domains → Add Domain**) i wtedy wysyłać
   np. z `kontakt@harmonia-gabinet.pl`.

## 2. Wdróż Edge Function w Supabase
1. W Supabase: **Edge Functions** (lewe menu) → **Create a new function**.
2. Nazwa funkcji: `send-booking-email` (dokładnie tak, małymi literami, z myślnikami).
3. Wklej zawartość pliku `supabase/functions/send-booking-email/index.ts` z tej paczki.
4. Kliknij **Deploy**.

## 3. Dodaj sekrety (klucze, których funkcja używa)
W Supabase: **Edge Functions → Manage secrets** (albo **Project Settings → Edge Functions**):
- `RESEND_API_KEY` = Twój klucz z Resend (`re_...`)
- `THERAPIST_EMAIL` = e-mail terapeutki, na który mają przychodzić powiadomienia o nowych rezerwacjach
- `BOOKING_FROM_EMAIL` (opcjonalnie) = np. `Harmonia <onboarding@resend.dev>` — jeśli pominiesz, użyje się to domyślnie

## 4. Gotowe — kiedy maile się wysyłają
- **Nowa rezerwacja** → e-mail do klienta ("oczekuje na potwierdzenie") + e-mail do terapeutki.
- **Terapeutka klika ✓ Zatwierdź** → e-mail do klienta ("sesja potwierdzona").
- **Terapeutka klika ⛔ Odwołaj** → e-mail do klienta ("rezerwacja odwołana").

Błąd wysyłki maila **nie blokuje** rezerwacji ani zmiany statusu — jeśli
Resend akurat nie odpowie, rezerwacja i tak się zapisze, a błąd trafi tylko
do konsoli przeglądarki (`console.warn`).

## Potwierdzenie e-maila przy rejestracji (osobna sprawa)
To obsługuje sam Supabase Auth, nie Resend. W **Authentication → Sign In / Up
→ User Signups** włącz z powrotem **"Confirm email"** (wyłączyłaś to wcześniej
na czas testów). Domyślny mailer Supabase wysyła te maile automatycznie, ale
ma limit 2 maile/godzinę — dla realnego ruchu warto docelowo podłączyć
**Custom SMTP** (np. też przez Resend) w **Authentication → Emails → SMTP Settings**.
