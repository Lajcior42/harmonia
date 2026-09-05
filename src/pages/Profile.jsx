import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { LogOut, ShieldCheck, CalendarPlus, Clock } from "lucide-react";
import { COLORS } from "../theme.js";
import { supabase } from "../lib/supabaseClient.js";

function SectionLabel({ children }) {
  return <p className="text-xs uppercase mb-2" style={{ color: COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

const MONTHS = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

function formatDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function statusStyle(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("potwierdz")) return { bg: `${COLORS.mint}22`, fg: COLORS.mintDark, label: "Potwierdzona" };
  if (s.includes("odwoł") || s.includes("odwol")) return { bg: `${COLORS.danger}18`, fg: COLORS.danger, label: "Odwołana" };
  return { bg: `${COLORS.gold}22`, fg: COLORS.goldDark, label: "Oczekuje na potwierdzenie" };
}

export default function Profile() {
  const { session, onLogout } = useOutletContext();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) { setLoading(false); return; }
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_my_bookings");
      if (active) {
        setBookings(!error && Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [session]);

  if (!session) {
    return (
      <div className="fade-in">
        <SectionLabel>Profil</SectionLabel>
        <div className="rounded-2xl p-8 text-center" style={{ background: COLORS.surface, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Nie jesteś zalogowana/y.</p>
          <button onClick={() => navigate("/login")} className="glow-btn px-6 py-2.5 rounded-full text-sm" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>Zaloguj się</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <SectionLabel>Profil</SectionLabel>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28 }} className="mb-6">Cześć, {session.name}</h1>

      <div className="rounded-2xl p-6 mb-8" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
        <div className="flex justify-between text-sm py-2" style={{ borderBottom: `1px solid ${COLORS.line}` }}><span style={{ color: COLORS.textMuted }}>E-mail</span><span style={{ fontWeight: 700 }}>{session.email}</span></div>
        <div className="flex justify-between text-sm py-2"><span style={{ color: COLORS.textMuted }}>Rola</span><span style={{ fontWeight: 700 }}>{session.role === "admin" ? "Terapeutka" : "Klient"}</span></div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20 }}>Twoje wizyty</h2>
        <button onClick={() => navigate("/rezerwacja")} className="flex items-center gap-1.5 text-sm underline" style={{ color: COLORS.ink, fontWeight: 700 }}>
          <CalendarPlus size={15} /> Nowa rezerwacja
        </button>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: COLORS.textMuted }}>Wczytywanie…</p>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl p-8 text-center mb-8" style={{ background: COLORS.surface, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Nie masz jeszcze żadnych rezerwacji.</p>
          <button onClick={() => navigate("/rezerwacja")} className="glow-btn px-6 py-2.5 rounded-full text-sm" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>Zarezerwuj wizytę</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-8">
          {bookings.map((b) => {
            const st = statusStyle(b.status);
            return (
              <div key={b.id} className="rounded-2xl p-5" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm" style={{ fontWeight: 700, color: COLORS.ink }}>{b.service}</p>
                  <span className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background: st.bg, color: st.fg, fontWeight: 700 }}>{st.label}</span>
                </div>
                <div className="flex items-center gap-4 text-sm" style={{ color: COLORS.textMuted }}>
                  <span className="flex items-center gap-1.5"><Clock size={14} strokeWidth={1.7} />{formatDate(b.date)}, {b.time}</span>
                  <span>{b.form}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {session.role === "admin" && (
        <button onClick={() => navigate("/admin")} className="glow-btn w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm mb-3" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>
          <ShieldCheck size={15} /> Przełącz na Panel Terapeuty
        </button>
      )}
      <button onClick={() => { onLogout(); navigate("/"); }} className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm" style={{ border: `1px solid ${COLORS.lineStrong}`, color: COLORS.ink, fontWeight: 700 }}>
        <LogOut size={15} /> Wyloguj się
      </button>
    </div>
  );
}
