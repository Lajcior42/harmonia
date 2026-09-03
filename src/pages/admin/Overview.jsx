import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { CalendarDays, UserPlus, Wallet, PieChart, Check, Ban } from "lucide-react";
import { COLORS } from "../../theme.js";
import { SERVICES } from "../../data/services.js";
import { addDays, dateKey, formatShort } from "../../utils/date.js";

function StatusBadge({ status }) {
  const map = {
    potwierdzona: { bg: "#EAF0E7", color: COLORS.mintDark },
    oczekuje: { bg: "#FBEFDD", color: COLORS.goldDark },
    odwołana: { bg: "#F5E1DC", color: COLORS.danger },
  };
  const s = map[status] || map.oczekuje;
  return <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color, fontWeight: 700 }}>{status}</span>;
}

export default function Overview() {
  const { session, bookings, updateBookingStatus } = useOutletContext();
  const weekKeys = useMemo(() => Array.from({ length: 7 }, (_, i) => dateKey(addDays(i))), []);

  const stats = useMemo(() => {
    const thisWeek = bookings.filter((b) => weekKeys.includes(b.date) && b.status !== "odwołana");
    const pending = bookings.filter((b) => b.status === "oczekuje");
    const revenue = bookings.filter((b) => b.status !== "odwołana").reduce((sum, b) => {
      const svc = SERVICES.find((s) => s.title === b.service);
      return sum + (svc ? parseInt(svc.price) : 0);
    }, 0);
    const uniqueClients = new Set(bookings.map((b) => b.clientEmail)).size;
    return { thisWeek: thisWeek.length, pending: pending.length, revenue, uniqueClients };
  }, [bookings, weekKeys]);

  const upcoming = useMemo(
    () => [...bookings].filter((b) => b.status !== "odwołana").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 6),
    [bookings]
  );

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28 }} className="mb-1">Dzień dobry, {session?.name || "Anno"}</h1>
      <p className="text-sm mb-7" style={{ color: COLORS.textMuted }}>Oto jak wygląda Twój gabinet dzisiaj.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
        {[
          { label: "Sesje w tym tygodniu", value: stats.thisWeek, icon: CalendarDays },
          { label: "Oczekujące na akceptację", value: stats.pending, icon: UserPlus },
          { label: "Przychód (łącznie)", value: `${stats.revenue} zł`, icon: Wallet },
          { label: "Klienci w bazie", value: stats.uniqueClients, icon: PieChart },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glow-card rounded-2xl p-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
            <div className="flex items-center justify-between mb-3"><span className="text-xs" style={{ color: COLORS.textMuted }}>{label}</span><Icon size={15} style={{ color: COLORS.gold }} /></div>
            <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 24 }}>{value}</p>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19 }} className="mb-3">Nadchodzące sesje</h2>
      <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
        {upcoming.length === 0 && <p className="text-sm px-5 py-6 text-center" style={{ color: COLORS.textMuted }}>Brak zaplanowanych sesji.</p>}
        {upcoming.map((s, i) => (
          <div key={s.id} className="flex items-center justify-between px-5 py-3.5 gap-3 flex-wrap" style={{ borderBottom: i < upcoming.length - 1 ? `1px solid ${COLORS.line}` : "none" }}>
            <div>
              <p className="text-sm" style={{ fontWeight: 700 }}>{s.clientName}</p>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>{s.service} · {s.form}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: COLORS.textMuted }}>{formatShort(new Date(s.date))}, {s.time}</span>
              <StatusBadge status={s.status} />
              {s.status === "oczekuje" && (
                <button onClick={() => updateBookingStatus(s.id, "potwierdzona")} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${COLORS.mint}22`, color: COLORS.mintDark }} title="Zatwierdź">
                  <Check size={14} strokeWidth={3} />
                </button>
              )}
              <button onClick={() => updateBookingStatus(s.id, "odwołana")} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${COLORS.danger}18`, color: COLORS.danger }} title="Odwołaj">
                <Ban size={14} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
