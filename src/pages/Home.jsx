import { useNavigate } from "react-router-dom";
import { Quote, ArrowRight } from "lucide-react";
import { COLORS } from "../theme.js";

const TESTIMONIAL = { name: "Kasia, 34 lata", text: "Po pierwszej sesji harmonizacji spałam tej nocy lepiej niż od miesięcy. Nie spodziewałam się tak wyraźnej różnicy." };

function SectionLabel({ children }) {
  return <p className="text-xs uppercase mb-2" style={{ color: COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <SectionLabel>Harmonia · Gabinet bioenergoterapii</SectionLabel>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 34, lineHeight: 1.15 }} className="mb-4">Wróć do wewnętrznej równowagi</h1>
          <p className="text-sm mb-7 max-w-lg" style={{ color: COLORS.textMuted, lineHeight: 1.7 }}>
            Nazywam się <strong style={{ color: COLORS.ink }}>Anna Pietrzak Gryc</strong> — jestem założycielką i organizatorką gabinetu Harmonia.
            Pracuję z energią ciała, by pomóc Ci odzyskać spokój, sen i poczucie stabilności.
            Każda sesja jest dopasowana do tego, co dzieje się w Twoim życiu właśnie teraz.
          </p>
          <button onClick={() => navigate("/oferta")} className="glow-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>
            Zobacz ofertę <ArrowRight size={15} />
          </button>
        </div>
        <div className="relative">
          <div className="blob absolute -inset-4 -z-10" style={{ background: `linear-gradient(135deg, ${COLORS.gold}66, ${COLORS.mint}55, ${COLORS.blue}55)` }} />
          <img src="https://images.pexels.com/photos/6998265/pexels-photo-6998265.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Sesja bioenergoterapii w spokojnym, naturalnym świetle" className="w-full h-64 md:h-80 object-cover rounded-[2rem]" />
        </div>
      </div>

      <div className="glow-card rounded-[1.75rem] p-6 md:p-8 mb-6 grid md:grid-cols-3 gap-6 items-center" style={{ background: `${COLORS.blue}1A`, border: `1px solid ${COLORS.blue}33` }}>
        <img src="https://images.pexels.com/photos/3278758/pexels-photo-3278758.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Kamienie energetyczne na dłoni" className="w-full h-32 md:h-full object-cover rounded-2xl" />
        <div className="md:col-span-2">
          <Quote size={18} style={{ color: COLORS.blueDark }} className="mb-3" />
          <p className="text-sm mb-3" style={{ color: COLORS.ink, lineHeight: 1.6, fontStyle: "italic" }}>"{TESTIMONIAL.text}"</p>
          <p className="text-xs mb-4" style={{ color: COLORS.blueDark, fontWeight: 700 }}>{TESTIMONIAL.name}</p>
          <button onClick={() => navigate("/o-mnie")} className="text-sm underline" style={{ color: COLORS.ink, fontWeight: 700 }}>Więcej opinii i moja historia →</button>
        </div>
      </div>

      <div className="rounded-[1.75rem] p-8 text-center" style={{ background: `linear-gradient(135deg, ${COLORS.mint}, ${COLORS.blue})` }}>
        <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: "#fff" }} className="mb-2">Pierwszy krok bywa najtrudniejszy</p>
        <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.9)" }}>Umów pierwszą sesję i zobacz, jak się poczujesz.</p>
        <button onClick={() => navigate("/rezerwacja")} className="glow-btn px-6 py-2.5 rounded-full text-sm" style={{ background: "#fff", color: COLORS.mintDark, fontWeight: 700 }}>Zarezerwuj termin</button>
      </div>
    </div>
  );
}
