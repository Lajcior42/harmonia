import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Lock, Unlock } from "lucide-react";
import { COLORS } from "../../theme.js";
import { addDays, dateKey } from "../../utils/date.js";

const DAY_LABELS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];
const HOURS = ["9:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00"];

export default function Schedule() {
  const { bookings, blockedSlots, toggleBlockedSlot } = useOutletContext();
  const visibleWeekDays = useMemo(() => Array.from({ length: 6 }, (_, i) => addDays(i - new Date().getDay() + 1)), []);

  function slotInfo(date, hour) {
    const key = dateKey(date);
    const booking = bookings.find((b) => b.date === key && b.time === hour && b.status !== "odwołana");
    const blocked = blockedSlots.some((s) => s.date === key && s.time === hour);
    if (booking) return { type: "booked", booking };
    if (blocked) return { type: "blocked" };
    return { type: "free" };
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28 }} className="mb-1">Grafik tygodnia</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>Kliknij wolny termin, by go zablokować (np. urlop), lub zablokowany, by go odblokować.</p>

      <div className="flex items-center gap-4 mb-4 text-xs flex-wrap" style={{ color: COLORS.textMuted }}>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#EAF0E7" }} /> Wolny</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.gold }} /> Zarezerwowany</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "#E9DCC8" }} /> Zablokowany</span>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 560 }}>
          <div className="grid" style={{ gridTemplateColumns: `70px repeat(${visibleWeekDays.length}, 1fr)` }}>
            <div />
            {visibleWeekDays.map((d) => (
              <div key={dateKey(d)} className="text-center text-xs pb-2" style={{ color: COLORS.textMuted, fontWeight: 700 }}>
                {DAY_LABELS[d.getDay() === 0 ? 5 : d.getDay() - 1]} {d.getDate()}
              </div>
            ))}
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                <div className="text-xs pr-2 py-2 text-right" style={{ color: COLORS.textMuted }}>{hour}</div>
                {visibleWeekDays.map((d) => {
                  const key = dateKey(d);
                  const info = slotInfo(d, hour);
                  return (
                    <button
                      key={key + hour}
                      onClick={() => info.type !== "booked" && toggleBlockedSlot(key, hour)}
                      disabled={info.type === "booked"}
                      className="m-0.5 rounded-lg flex items-center justify-center"
                      style={{ height: 40, background: info.type === "booked" ? COLORS.gold : info.type === "blocked" ? "#E9DCC8" : "#EAF0E7", cursor: info.type === "booked" ? "not-allowed" : "pointer" }}
                      title={info.type === "booked" ? `${info.booking.clientName} — ${info.booking.service}` : info.type === "blocked" ? "Zablokowany — kliknij, by odblokować" : "Wolny — kliknij, by zablokować"}
                    >
                      {info.type === "blocked" && <Lock size={13} style={{ color: "#8A7654" }} />}
                      {info.type === "free" && <Unlock size={12} style={{ color: "#B7C4B1", opacity: 0.6 }} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
