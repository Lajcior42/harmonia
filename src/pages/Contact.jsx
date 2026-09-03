import { useState } from "react";
import { Check, Mail, Phone, MapPin, Instagram, Facebook, ChevronDown } from "lucide-react";
import { COLORS } from "../theme.js";

const FAQ_ITEMS = [
  { q: "Jak wygląda pierwsza sesja?", a: "Zaczynamy od krótkiej rozmowy o tym, co Cię do mnie sprowadza i jak się obecnie czujesz. Sama sesja trwa 45–60 minut i odbywa się w spokojnej, przyciemnionej przestrzeni — leżysz lub siedzisz w wygodnej pozycji." },
  { q: "Czy bioenergoterapia zastępuje leczenie medyczne?", a: "Nie. Bioenergoterapia jest formą wsparcia uzupełniającego, a nie zamiennikiem konsultacji lekarskiej, diagnostyki czy leczenia farmakologicznego. W razie wątpliwości zdrowotnych zawsze warto skonsultować się z lekarzem." },
  { q: "Jak przygotować się do sesji?", a: "Wystarczy wygodny strój i unikanie ciężkiego posiłku bezpośrednio przed wizytą. Do sesji zdalnej warto dodatkowo znaleźć ciche miejsce, w którym nikt Ci nie przeszkodzi przez ok. godzinę." },
  { q: "Ile sesji jest zazwyczaj potrzebnych?", a: "To bardzo indywidualne — niektórzy klienci czują wyraźną różnicę już po jednej sesji, inni decydują się na cykl 3–5 spotkań rozłożonych w czasie. Po pierwszej wizycie razem ustalimy, co ma sens w Twoim przypadku." },
  { q: "Czy sesja na odległość naprawdę działa?", a: "Praca z energią nie jest ograniczona fizyczną obecnością — wiele osób zgłasza podobne odczucia po sesjach zdalnych, co po stacjonarnych. Ty tylko potrzebujesz spokojnego miejsca i chwili czasu dla siebie." },
];

const TOPICS = ["Pytanie o ofertę", "Zmiana / odwołanie rezerwacji", "Współpraca / warsztaty", "Inne"];

function SectionLabel({ children }) {
  return <p className="text-xs uppercase mb-2" style={{ color: COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between text-left px-5 py-4">
        <span className="text-sm" style={{ fontWeight: 700, color: COLORS.ink }}>{q}</span>
        <ChevronDown size={16} style={{ color: COLORS.gold, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} />
      </button>
      {open && (
        <div className="px-5 pb-4 fade-in">
          <p className="text-sm" style={{ color: COLORS.textMuted, lineHeight: 1.65 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  const [contactSent, setContactSent] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);

  function handleSubmit(e) {
    e.preventDefault();
    setContactSent(true);
  }

  return (
    <div className="fade-in">
      <SectionLabel>Kontakt</SectionLabel>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30 }} className="mb-8">Napisz albo zadzwoń</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          {contactSent ? (
            <div className="rounded-2xl p-6 text-center" style={{ background: `${COLORS.mint}1A`, border: `1px solid ${COLORS.mint}44` }}>
              <Check size={22} style={{ color: COLORS.mintDark }} className="mx-auto mb-2" />
              <p style={{ fontWeight: 700 }} className="mb-1">Wiadomość wysłana</p>
              <p className="text-sm" style={{ color: COLORS.textMuted }}>Odpiszę najszybciej, jak będę mogła.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="text-sm px-4 py-3 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}`, background: COLORS.surface, color: COLORS.ink }}>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input placeholder="Imię i nazwisko" required className="text-sm px-4 py-3 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}`, background: COLORS.surface }} />
              <input placeholder="E-mail" type="email" required className="text-sm px-4 py-3 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}`, background: COLORS.surface }} />
              <textarea placeholder="Wiadomość" required rows={4} className="text-sm px-4 py-3 rounded-xl outline-none resize-none" style={{ border: `1px solid ${COLORS.line}`, background: COLORS.surface }} />
              <button type="submit" className="glow-btn py-3 rounded-full text-sm" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>Wyślij wiadomość</button>
            </form>
          )}
        </div>

        <div>
          <div className="rounded-2xl p-6 mb-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
            <p className="text-sm mb-3" style={{ fontWeight: 700, color: COLORS.ink }}>Anna Pietrzak Gryc<span className="block text-xs" style={{ fontWeight: 400, color: COLORS.textMuted }}>Gabinet bioenergoterapii Harmonia</span></p>
            <div className="flex items-center gap-3 mb-3"><Phone size={16} style={{ color: COLORS.blue }} /><span className="text-sm">500 100 200</span></div>
            <div className="flex items-center gap-3 mb-3"><Mail size={16} style={{ color: COLORS.blue }} /><span className="text-sm">kontakt@harmonia-gabinet.pl</span></div>
            <div className="flex items-center gap-3 mb-4"><MapPin size={16} style={{ color: COLORS.blue }} /><span className="text-sm">ul. Spokojna 12, 15-001 Białystok</span></div>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${COLORS.blue}15`, color: COLORS.blue }}><Instagram size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${COLORS.blue}15`, color: COLORS.blue }}><Facebook size={16} /></a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-40 flex items-center justify-center" style={{ background: `${COLORS.blue}15`, border: `1px solid ${COLORS.blue}33` }}>
            <div className="text-center">
              <MapPin size={22} style={{ color: COLORS.blueDark }} className="mx-auto mb-1" />
              <p className="text-xs" style={{ color: COLORS.blueDark, fontWeight: 600 }}>Podgląd mapy — podłączymy Google Maps po wdrożeniu</p>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22 }} className="mb-4">Najczęściej zadawane pytania</h2>
      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => <FaqItem key={item.q} q={item.q} a={item.a} />)}
      </div>
    </div>
  );
}
