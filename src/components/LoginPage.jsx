import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";
import { COLORS } from "../theme.js";
import { supabase } from "../lib/supabaseClient.js";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email || !password) {
      setError("Podaj e-mail i hasło.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || email.split("@")[0] } },
        });
        if (signUpError) throw signUpError;
        setInfo("Konto utworzone! Jeśli Twój projekt Supabase wymaga potwierdzenia e-maila, sprawdź skrzynkę — w przeciwnym razie możesz się już zalogować.");
        setMode("login");
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;

        const userId = data.user.id;
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", userId)
          .single();
        if (profileError) throw profileError;

        const user = { id: userId, role: profile.role, name: profile.full_name || email.split("@")[0], email };
        onLogin(user);
        navigate(user.role === "admin" ? "/admin" : "/");
      }
    } catch (err) {
      setError(err.message || "Coś poszło nie tak. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: COLORS.bg, fontFamily: "'Work Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');`}</style>

      <div className="w-full max-w-sm">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: COLORS.textMuted }}>
          <ArrowLeft size={15} />
          Wróć do strony
        </button>

        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLORS.gold, color: "#fff" }}>
            <Leaf size={16} />
          </div>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, color: COLORS.ink }}>Harmonia</span>
        </div>

        <div className="rounded-[1.5rem] p-7" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: COLORS.ink }} className="mb-1">
            {mode === "login" ? "Zaloguj się" : "Załóż konto"}
          </p>
          <p className="text-sm mb-6" style={{ color: COLORS.textMuted }}>
            {mode === "login" ? "Zobacz swoje rezerwacje i profil." : "Zajmie dosłownie chwilę."}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <input type="text" placeholder="Imię i nazwisko" value={name} onChange={(e) => setName(e.target.value)}
                className="text-sm px-3 py-2.5 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}` }} />
            )}
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
              className="text-sm px-3 py-2.5 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}` }} />
            <input type="password" placeholder="Hasło" value={password} onChange={(e) => setPassword(e.target.value)}
              className="text-sm px-3 py-2.5 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}` }} />
            {error && <p className="text-xs" style={{ color: COLORS.danger || "#B04B36" }}>{error}</p>}
            {info && <p className="text-xs" style={{ color: COLORS.mintDark || COLORS.mint }}>{info}</p>}
            <button type="submit" disabled={loading} className="py-2.5 rounded-full text-sm mt-1" style={{ background: COLORS.gold, color: "#fff", fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Chwila…" : mode === "login" ? "Zaloguj się" : "Załóż konto"}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setInfo(""); }}
            className="text-xs mt-5 pt-5 w-full text-center"
            style={{ color: COLORS.textMuted, borderTop: `1px solid ${COLORS.line}` }}
          >
            {mode === "login" ? (
              <>Nie masz konta? <span style={{ color: COLORS.gold, fontWeight: 700 }}>Zarejestruj się</span></>
            ) : (
              <>Masz już konto? <span style={{ color: COLORS.gold, fontWeight: 700 }}>Zaloguj się</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
