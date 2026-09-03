import { Quote } from "lucide-react";
import { COLORS } from "../theme.js";

const TESTIMONIALS = [
  { name: "Kasia, 34 lata", text: "Po pierwszej sesji harmonizacji spałam tej nocy lepiej niż od miesięcy. Nie spodziewałam się tak wyraźnej różnicy." },
  { name: "Marek, 41 lat", text: "Sceptycznie podchodziłem do tematu, ale efekt spokoju po sesji był realny i utrzymał się przez kilka dni." },
  { name: "Ola, 27 lat", text: "Sesja na odległość okazała się równie mocna jak wizyta stacjonarna. Wygodna opcja przy napiętym grafiku." },
];

function SectionLabel({ children }) {
  return <p className="text-xs uppercase mb-2" style={{ color: COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

export default function About() {
  return (
    <div className="fade-in">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-10">
        <div>
          <SectionLabel>O mnie</SectionLabel>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30 }} className="mb-2">Anna Pietrzak Gryc</h1>
          <p className="text-sm mb-5" style={{ color: COLORS.gold, fontWeight: 700 }}>Założycielka i organizatorka gabinetu Harmonia · bioenergoterapeutka</p>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted, lineHeight: 1.75 }}>
            Bioenergoterapią zajmuję się od kilkunastu lat. Prowadzę gabinet Harmonia, w którym łączę tradycyjne techniki pracy z energią człowieka z uważnym, spokojnym podejściem do każdej osoby, która do mnie trafia.
          </p>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted, lineHeight: 1.75 }}>
            Oprócz sesji indywidualnych — stacjonarnych i na odległość — organizuję warsztaty oraz spotkania grupowe poświęcone pracy z ciałem energetycznym, oddechem i regeneracją.
          </p>
          <p className="text-sm" style={{ color: COLORS.textMuted, lineHeight: 1.75 }}>
            Wierzę, że ciało samo wie, jak wracać do równowagi, jeśli tylko stworzymy mu do tego odpowiednie warunki — spokój, uwagę i przestrzeń bez pośpiechu.
          </p>
        </div>
        <div className="relative">
          <div className="blob absolute -inset-3 -z-10" style={{ background: `linear-gradient(135deg, ${COLORS.mint}55, ${COLORS.blue}55)` }} />
          <img src="https://images.pexels.com/photos/6634983/pexels-photo-6634983.jpeg?auto=compress&cs=tinysrgb&w=700" alt="Anna Pietrzak Gryc — bioenergoterapeutka, założycielka gabinetu Harmonia" className="w-full h-80 object-cover rounded-[2rem]" />
          <p className="text-xs mt-2 text-center" style={{ color: COLORS.textMuted }}>Anna Pietrzak Gryc — zdjęcie poglądowe</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] p-6 md:p-8 mb-10" style={{ background: `${COLORS.mint}22`, border: `1px solid ${COLORS.mint}44` }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19, color: COLORS.ink }} className="mb-3">Czym jest bioenergoterapia?</h2>
        <p className="text-sm" style={{ color: "#4E5A56", lineHeight: 1.75 }}>
          To forma pracy z ciałem energetycznym człowieka — polem, które według wielu tradycji otacza i przenika ciało fizyczne. Praca bioenergoterapeuty polega na rozpoznaniu miejsc zablokowanej energii i przywróceniu w nich naturalnego przepływu. Jest wsparciem uzupełniającym, a nie zamiennikiem leczenia medycznego.
        </p>
      </div>

      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22 }} className="mb-4">Co mówią klienci</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="glow-card rounded-2xl p-5" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
            <Quote size={16} style={{ color: COLORS.blue }} className="mb-2" />
            <p className="text-sm mb-3" style={{ color: COLORS.ink, lineHeight: 1.6, fontStyle: "italic" }}>"{t.text}"</p>
            <p className="text-xs" style={{ color: COLORS.blueDark, fontWeight: 700 }}>{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
