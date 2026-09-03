import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { COLORS } from "../theme.js";

function SectionLabel({ children }) {
  return <p className="text-xs uppercase mb-2" style={{ color: COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

export default function Profile() {
  const { session, onLogout } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      <SectionLabel>Profil</SectionLabel>
      {session ? (
        <>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28 }} className="mb-6">Cześć, {session.name}</h1>
          <div className="rounded-2xl p-6 mb-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
            <div className="flex justify-between text-sm py-2" style={{ borderBottom: `1px solid ${COLORS.line}` }}><span style={{ color: COLORS.textMuted }}>E-mail</span><span style={{ fontWeight: 700 }}>{session.email}</span></div>
            <div className="flex justify-between text-sm py-2"><span style={{ color: COLORS.textMuted }}>Rola</span><span style={{ fontWeight: 700 }}>{session.role === "admin" ? "Terapeutka" : "Klient"}</span></div>
          </div>
          {session.role === "admin" && (
            <button onClick={() => navigate("/admin")} className="glow-btn w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm mb-3" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>
              <ShieldCheck size={15} /> Przełącz na Panel Terapeuty
            </button>
          )}
          <button onClick={() => { onLogout(); navigate("/"); }} className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm" style={{ border: `1px solid ${COLORS.lineStrong}`, color: COLORS.ink, fontWeight: 700 }}>
            <LogOut size={15} /> Wyloguj się
          </button>
        </>
      ) : (
        <div className="rounded-2xl p-8 text-center" style={{ background: COLORS.surface, border: `1px dashed ${COLORS.line}` }}>
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted }}>Nie jesteś zalogowana/y.</p>
          <button onClick={() => navigate("/login")} className="glow-btn px-6 py-2.5 rounded-full text-sm" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700 }}>Zaloguj się</button>
        </div>
      )}
    </div>
  );
}
