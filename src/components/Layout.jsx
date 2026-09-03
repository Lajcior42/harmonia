import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, User, Sparkles, CalendarCheck, Mail, Phone } from "lucide-react";
import { COLORS, GLOBAL_CSS } from "../theme.js";

const NAV_ITEMS = [
  { to: "/", label: "Strona główna", icon: Home, end: true },
  { to: "/o-mnie", label: "O mnie", icon: User },
  { to: "/oferta", label: "Oferta", icon: Sparkles },
  { to: "/rezerwacja", label: "Rezerwacja", icon: CalendarCheck },
  { to: "/kontakt", label: "Kontakt", icon: Mail },
];

function WaveSplit() {
  // Falowana linia dzieląca tło: lewa strona miętowa, prawa jaśniejszy granat.
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <rect width="100" height="100" fill={COLORS.mintBg} />
      <path
        d="M58 -2
           C 50 10, 66 18, 58 30
           C 50 42, 66 50, 58 62
           C 50 74, 66 82, 58 94
           C 54 100, 56 100, 58 102
           L 102 102 L 102 -2 Z"
        fill={COLORS.navySoft}
      />
    </svg>
  );
}

export default function Layout({ session, onLogout, addBooking, isSlotUnavailable }) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative"
      style={{ background: COLORS.mintBg, color: COLORS.ink, fontFamily: "'Work Sans', sans-serif" }}
    >
      <style>{GLOBAL_CSS}</style>
      <WaveSplit />

      {/* ---------- DESKTOP TOP NAV ---------- */}
      <header className="hidden md:flex sticky top-0 z-40 items-center justify-between h-20 px-10" style={{ background: "rgba(230,240,236,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${COLORS.line}` }}>
        <div className="flex items-center gap-12">
          <div className="flex flex-col leading-tight">
            <span className="shimmer-text" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 24 }}>Harmonia</span>
            <span style={{ fontSize: 11, color: COLORS.textMuted, letterSpacing: "0.08em" }}>Bioenergoterapia · Anna Pietrzak Gryc</span>
          </div>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? COLORS.gold : COLORS.textMuted,
                  fontWeight: isActive ? 700 : 400,
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                })}
              >
                <Icon size={16} strokeWidth={1.8} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a href="tel:+48519129909" className="flex items-center gap-2 text-sm mr-2" style={{ color: COLORS.textMuted }}>
            <Phone size={15} strokeWidth={1.6} />
            <span>519 129 909</span>
          </a>
          <button onClick={() => navigate("/rezerwacja")} className="glow-btn px-5 py-2.5 rounded-full text-sm" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>
            Zarezerwuj sesję
          </button>
          {session ? (
            <button onClick={() => navigate("/profil")} className="w-10 h-10 rounded-full flex items-center justify-center text-xs" style={{ background: COLORS.ink, color: COLORS.bg, fontWeight: 700 }} title={session.name}>
              {session.name.slice(0, 2).toUpperCase()}
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ color: COLORS.ink, border: `1px solid ${COLORS.lineStrong}` }} title="Zaloguj się">
              <User size={16} strokeWidth={1.7} />
            </button>
          )}
        </div>
      </header>

      {/* ---------- MOBILE TOP BAR ---------- */}
      <header className="flex md:hidden items-center justify-between h-16 px-5 sticky top-0 z-40" style={{ background: "rgba(230,240,236,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${COLORS.line}` }}>
        <span className="shimmer-text" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20 }}>Harmonia</span>
        <div className="flex items-center gap-2">
          <a href="tel:+48519129909" className="w-9 h-9 flex items-center justify-center rounded-full" style={{ color: COLORS.ink, background: COLORS.surface }}>
            <Phone size={16} strokeWidth={1.7} />
          </a>
          {session ? (
            <button onClick={() => navigate("/profil")} className="w-9 h-9 rounded-full flex items-center justify-center text-xs" style={{ background: COLORS.ink, color: COLORS.bg, fontWeight: 700 }}>
              {session.name.slice(0, 2).toUpperCase()}
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ color: COLORS.ink, background: COLORS.surface }}>
              <User size={16} strokeWidth={1.7} />
            </button>
          )}
        </div>
      </header>

      {/* ---------- PAGE CONTENT ---------- */}
      <main
        className="relative z-[1] px-5 md:px-10 py-10 pb-28 md:pb-10 md:my-10 max-w-3xl mx-auto md:rounded-[1.75rem]"
        style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 24px 60px -24px rgba(27,39,64,0.45)" }}
      >
        <Outlet context={{ session, onLogout, addBooking, isSlotUnavailable }} />
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="relative z-[1]" style={{ background: COLORS.navyDeep, color: "rgba(255,255,255,0.72)" }}>
        <div className="px-5 md:px-10 pb-28 md:pb-10 pt-8 max-w-3xl mx-auto">
          <p className="text-sm mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#fff" }}>Harmonia — Gabinet Bioenergoterapii</p>
          <p className="text-xs mb-1">Anna Pietrzak Gryc — założycielka i organizatorka</p>
          <p className="text-xs">Sobolewo k. Białegostoku · 519 129 909 · apietrzakgryc@gmail.com</p>
          <p className="text-xs mt-3" style={{ opacity: 0.6 }}>© {new Date().getFullYear()} Harmonia. Zdjęcia poglądowe.</p>
        </div>
      </footer>

      {/* ---------- MOBILE BOTTOM NAV ---------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" style={{ background: COLORS.surface, borderTop: `1px solid ${COLORS.line}`, paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-stretch justify-between px-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="relative flex-1 flex flex-col items-center justify-center gap-1 py-3">
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-1.5 w-1.5 h-1.5 rounded-full" style={{ background: COLORS.gold, boxShadow: `0 0 8px ${COLORS.gold}` }} />}
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} style={{ color: isActive ? COLORS.gold : "#BFC7BE" }} className={`transition-transform duration-150 ${isActive ? "-translate-y-0.5" : ""}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
