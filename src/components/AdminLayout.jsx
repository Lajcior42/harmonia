import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, CalendarDays, Users, Sparkles, Menu, X, LogOut } from "lucide-react";
import { COLORS, GLOBAL_CSS } from "../theme.js";

const NAV_ITEMS = [
  { to: "/admin/przeglad", label: "Przegląd", icon: LayoutGrid },
  { to: "/admin/grafik", label: "Grafik", icon: CalendarDays },
  { to: "/admin/klienci", label: "Klienci", icon: Users },
  { to: "/admin/uslugi", label: "Usługi", icon: Sparkles },
];

export default function AdminLayout({ session, onLogout, bookings, blockedSlots, updateBookingStatus, toggleBlockedSlot }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const pending = bookings.filter((b) => b.status === "oczekuje").length;

  function handleLogout() {
    onLogout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex" style={{ background: COLORS.bg, color: COLORS.ink, fontFamily: "'Work Sans', sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 px-5 py-6" style={{ background: COLORS.surface, borderRight: `1px solid ${COLORS.line}` }}>
        <div className="flex items-center gap-2 mb-9 px-2">
          <span className="shimmer-text" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 21 }}>Harmonia</span>
        </div>
        <p className="text-xs uppercase px-2 mb-3" style={{ color: "#B0AC9C", letterSpacing: "0.1em" }}>Panel terapeutki</p>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left"
              style={({ isActive }) => ({ background: isActive ? `${COLORS.gold}15` : "transparent", color: isActive ? COLORS.goldDark : COLORS.textMuted, fontWeight: isActive ? 700 : 400 })}>
              <Icon size={17} strokeWidth={1.8} />
              {label}
              {to === "/admin/przeglad" && pending > 0 && (
                <span className="ml-auto text-xs w-5 h-5 rounded-full flex items-center justify-center" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>{pending}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm" style={{ color: COLORS.textMuted }}>
          <LogOut size={16} strokeWidth={1.7} />
          Wyloguj {session?.name ? `(${session.name})` : ""}
        </button>
      </aside>

      {/* ---------- MOBILE TOP BAR + DRAWER ---------- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-14 px-4" style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.line}` }}>
          <button onClick={() => setDrawerOpen(true)} style={{ color: COLORS.ink }}><Menu size={22} strokeWidth={1.8} /></button>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18 }}>Panel terapeutki</span>
          <div className="w-6" />
        </div>
        {drawerOpen && (
          <div className="fixed inset-0" style={{ background: "rgba(38,49,47,0.4)" }} onClick={() => setDrawerOpen(false)}>
            <div className="absolute top-0 left-0 bottom-0 w-64 p-5" style={{ background: COLORS.surface }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20 }}>Harmonia</span>
                <button onClick={() => setDrawerOpen(false)} style={{ color: COLORS.ink }}><X size={20} /></button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left"
                    style={({ isActive }) => ({ background: isActive ? `${COLORS.gold}15` : "transparent", color: isActive ? COLORS.goldDark : COLORS.textMuted, fontWeight: isActive ? 700 : 400 })}>
                    <Icon size={17} strokeWidth={1.8} />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="flex-1 px-5 md:px-10 py-8 pt-20 md:pt-8 max-w-5xl">
        <Outlet context={{ session, bookings, blockedSlots, updateBookingStatus, toggleBlockedSlot }} />
      </main>
    </div>
  );
}
