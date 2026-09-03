import { useState } from "react";
import { Pencil } from "lucide-react";
import { COLORS } from "../../theme.js";
import { SERVICES } from "../../data/services.js";

export default function Services() {
  const [services, setServices] = useState(SERVICES.map((s) => ({ ...s })));
  const [editingId, setEditingId] = useState(null);

  function updateService(id, field, value) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28 }} className="mb-1">Usługi</h1>
      <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>Zmiany widoczne są od razu w ofercie widocznej dla klientów.</p>

      <div className="flex flex-col gap-3">
        {services.map((s) => {
          const isEditing = editingId === s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${COLORS.gold}15`, color: COLORS.gold }}>
                <Icon size={18} strokeWidth={1.7} />
              </div>
              <div className="flex-1 grid sm:grid-cols-3 gap-3 items-center">
                {isEditing ? (
                  <input value={s.title} onChange={(e) => updateService(s.id, "title", e.target.value)} className="text-sm px-2 py-1.5 rounded-lg outline-none" style={{ border: `1px solid ${COLORS.lineStrong}` }} />
                ) : <span className="text-sm" style={{ fontWeight: 700 }}>{s.title}</span>}
                {isEditing ? (
                  <input value={s.duration} onChange={(e) => updateService(s.id, "duration", e.target.value)} className="text-sm px-2 py-1.5 rounded-lg outline-none" style={{ border: `1px solid ${COLORS.lineStrong}` }} />
                ) : <span className="text-sm" style={{ color: COLORS.textMuted }}>{s.duration}</span>}
                {isEditing ? (
                  <input value={s.price} onChange={(e) => updateService(s.id, "price", e.target.value)} className="text-sm px-2 py-1.5 rounded-lg outline-none" style={{ border: `1px solid ${COLORS.lineStrong}` }} />
                ) : <span className="text-sm" style={{ fontWeight: 700 }}>{s.price}</span>}
              </div>
              <button onClick={() => setEditingId(isEditing ? null : s.id)} className="text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0"
                style={{ background: isEditing ? COLORS.mint : "transparent", color: isEditing ? "#fff" : COLORS.ink, border: `1px solid ${isEditing ? COLORS.mint : COLORS.lineStrong}`, fontWeight: 700 }}>
                {isEditing ? "Zapisz" : (<><Pencil size={13} /> Edytuj</>)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
