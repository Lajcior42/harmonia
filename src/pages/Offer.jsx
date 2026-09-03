import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { COLORS } from "../theme.js";
import { SERVICES } from "../data/services.js";

function SectionLabel({ children }) {
  return <p className="text-xs uppercase mb-2" style={{ color: COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

export default function Offer() {
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      <SectionLabel>Oferta</SectionLabel>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30 }} className="mb-3">Wybierz sesję dopasowaną do Ciebie</h1>
      <p className="text-sm mb-8 max-w-xl" style={{ color: COLORS.textMuted, lineHeight: 1.7 }}>
        Wszystkie sesje bioenergoterapii prowadzi Anna Pietrzak Gryc — stacjonarnie w gabinecie Harmonia lub na odległość.
      </p>
      <div className="grid gap-5 md:grid-cols-3">
        {SERVICES.map(({ id, icon: Icon, title, duration, price, description, image }) => (
          <div key={id} className="glow-card rounded-[1.5rem] overflow-hidden flex flex-col" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
            <img src={image} alt={title} className="w-full h-36 object-cover" />
            <div className="p-6 flex flex-col flex-1">
              <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4 -mt-11 relative z-10" style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.mint}, ${COLORS.blue})`, color: "#fff", border: `3px solid ${COLORS.surface}`, boxShadow: `0 0 18px rgba(201,164,76,0.4)` }}>
                <Icon size={19} strokeWidth={1.9} />
              </div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19 }} className="mb-2">{title}</h3>
              <p className="text-sm mb-5 flex-1" style={{ color: COLORS.textMuted, lineHeight: 1.6 }}>{description}</p>
              <div className="flex items-center justify-between text-sm mb-4" style={{ color: COLORS.textMuted }}>
                <span className="flex items-center gap-1.5"><Clock size={14} strokeWidth={1.7} />{duration}</span>
                <span style={{ fontWeight: 700, color: COLORS.ink }}>{price}</span>
              </div>
              <button onClick={() => navigate("/rezerwacja", { state: { serviceId: id } })} className="glow-btn w-full py-2.5 rounded-full text-sm" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>Zarezerwuj</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
