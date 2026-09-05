import { COLORS } from "../theme.js";

function SectionLabel({ children }) {
  return <p className="text-xs uppercase mb-2" style={{ color: COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

const SECTIONS = [
  {
    h: "1. Administrator danych",
    p: "Administratorem danych osobowych jest Anna Pietrzak Gryc, prowadząca gabinet bioenergoterapii Harmonia w Sobolewie k. Białegostoku. Kontakt: apietrzakgryc@gmail.com, tel. 519 129 909.",
  },
  {
    h: "2. Jakie dane zbieramy",
    p: "Dane podane w formularzu kontaktowym i w rezerwacji: imię i nazwisko, adres e-mail, numer telefonu (przy sesjach na odległość) oraz treść wiadomości. Nie zbieramy danych o stanie zdrowia poza tym, co dobrowolnie przekażesz w wiadomości lub podczas sesji.",
  },
  {
    h: "3. Cel i podstawa przetwarzania",
    p: "Dane przetwarzamy w celu udzielenia odpowiedzi na zapytanie, umówienia i realizacji sesji oraz kontaktu w sprawie wizyty (art. 6 ust. 1 lit. b i f RODO). Podanie danych jest dobrowolne, ale niezbędne do umówienia wizyty.",
  },
  {
    h: "4. Jak długo przechowujemy dane",
    p: "Dane z korespondencji i rezerwacji przechowujemy przez czas potrzebny do obsługi sprawy oraz przez okres wynikający z przepisów (m.in. rozliczenia, ewentualne roszczenia), zwykle nie dłużej niż 3 lata od ostatniego kontaktu.",
  },
  {
    h: "5. Odbiorcy danych",
    p: "Dane mogą być powierzone dostawcom usług technicznych wspierających działanie strony i rezerwacji (hosting: Netlify; baza i logowanie: Supabase; obsługa formularza: FormSubmit). Podmioty te przetwarzają dane wyłącznie na nasze polecenie.",
  },
  {
    h: "6. Twoje prawa",
    p: "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, prawo sprzeciwu, prawo do przenoszenia danych oraz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych. Aby skorzystać z tych praw, napisz na apietrzakgryc@gmail.com.",
  },
  {
    h: "7. Pliki cookie",
    p: "Strona nie używa plików cookie do celów marketingowych ani śledzenia. Wykorzystujemy jedynie techniczne dane sesji niezbędne do działania logowania w panelu.",
  },
];

export default function Privacy() {
  return (
    <div className="fade-in">
      <SectionLabel>Dokumenty</SectionLabel>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30 }} className="mb-3">Polityka prywatności</h1>
      <p className="text-sm mb-8" style={{ color: COLORS.textMuted }}>
        Poniższy dokument opisuje, jak przetwarzamy dane osobowe przekazane przez formularz kontaktowy i rezerwację.
        To wersja podstawowa — przed pełnym wdrożeniem warto ją skonsultować.
      </p>

      <div className="flex flex-col gap-5">
        {SECTIONS.map((s) => (
          <div key={s.h} className="rounded-2xl p-5" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
            <h2 className="text-sm mb-2" style={{ fontWeight: 700, color: COLORS.ink }}>{s.h}</h2>
            <p className="text-sm" style={{ color: COLORS.textMuted, lineHeight: 1.7 }}>{s.p}</p>
          </div>
        ))}
      </div>

      <p className="text-xs mt-8" style={{ color: COLORS.textMuted }}>
        Bioenergoterapia jest formą wsparcia uzupełniającego i nie zastępuje konsultacji lekarskiej ani leczenia.
      </p>
    </div>
  );
}
