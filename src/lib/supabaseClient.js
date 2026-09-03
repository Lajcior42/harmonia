import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Nie wywalamy aplikacji — tylko ostrzegamy w konsoli, żeby build się nie wysypał
  // zanim uzupełnisz .env. Zobacz README_SUPABASE.md.
  console.warn(
    "Brak VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — uzupełnij plik .env (patrz README_SUPABASE.md)."
  );
}

export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-key");
