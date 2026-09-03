import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { COLORS } from "../../theme.js";

function StatusBadge({ status }) {
  const map = {
    potwierdzona: { bg: "#EAF0E7", color: COLORS.mintDark },
    oczekuje: { bg: "#FBEFDD", color: COLORS.goldDark },
    odwołana: { bg: "#F5E1DC", color: COLORS.danger },
  };
  const s = map[status] || map.oczekuje;
  return <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color, fontWeight: 700 }}>{status}</span>;
}

export default function Clients() {
  const { bookings } = useOutletContext();
  const [search, setSearch] = useState("");
  const [expandedClient, setExpandedClient] = useState(null);

  const clients = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (!map[b.clientEmail]) map[b.clientEmail] = { name: b.clientName, email: b.clientEmail, visits: [] };
      map[b.clientEmail].visits.push(b);
    });
    return Object.values(map).map((c) => ({ ...c, visits: c.visits.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)) }));
  }, [bookings]);

  const filteredClients = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28 }} className="mb-1">Klienci</h1>
      <p className="text-sm mb-5" style={{ color: COLORS.textMuted }}>{clients.length} osób w bazie</p>

      <div className="flex items-center gap-2 px-3 mb-5 rounded-xl" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}`, height: 42, maxWidth: 320 }}>
        <Search size={15} style={{ color: COLORS.textMuted }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Szukaj klienta…" className="flex-1 text-sm outline-none bg-transparent" style={{ color: COLORS.ink }} />
      </div>

      <div className="flex flex-col gap-3">
        {filteredClients.map((c) => {
          const isExpanded = expandedClient === c.email;
          return (
            <div key={c.email} className="rounded-2xl overflow-hidden" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
              <button onClick={() => setExpandedClient(isExpanded ? null : c.email)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                <div>
                  <p className="text-sm" style={{ fontWeight: 700 }}>{c.name}</p>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>{c.email} · {c.visits.length} {c.visits.length === 1 ? "wizyta" : "wizyt"}</p>
                </div>
                {isExpanded ? <ChevronUp size={16} style={{ color: COLORS.gold }} /> : <ChevronDown size={16} style={{ color: COLORS.gold }} />}
              </button>
              {isExpanded && (
                <div className="px-5 pb-4 fade-in">
                  {c.visits.map((v) => (
                    <div key={v.id} className="flex items-center justify-between text-sm py-2" style={{ borderTop: `1px solid ${COLORS.line}` }}>
                      <span style={{ color: COLORS.textMuted }}>{v.service} · {v.date}, {v.time}</span>
                      <StatusBadge status={v.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredClients.length === 0 && (
          <p className="text-sm px-5 py-6 text-center rounded-2xl" style={{ color: COLORS.textMuted, background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
            Brak wyników dla "{search}".
          </p>
        )}
      </div>
    </div>
  );
}
