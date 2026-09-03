import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import LoginPage from "./components/LoginPage.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Offer from "./pages/Offer.jsx";
import Booking from "./pages/Booking.jsx";
import Contact from "./pages/Contact.jsx";
import Profile from "./pages/Profile.jsx";

import AdminOverview from "./pages/admin/Overview.jsx";
import AdminSchedule from "./pages/admin/Schedule.jsx";
import AdminClients from "./pages/admin/Clients.jsx";
import AdminServices from "./pages/admin/Services.jsx";

import { supabase } from "./lib/supabaseClient.js";

function mapBookingRow(row) {
  return {
    id: row.id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    service: row.service,
    form: row.form,
    date: row.date,
    time: row.time,
    status: row.status,
  };
}

function RequireAdmin({ session, sessionLoading, children }) {
  if (sessionLoading) return null; // czekamy na ustalenie sesji, żeby nie mrugnąć ekranem "brak dostępu"
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#E6F0EC" }}>
        <div className="text-center max-w-sm">
          <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: "#26312F" }} className="mb-2">Brak dostępu</p>
          <p className="text-sm mb-5" style={{ color: "#788782" }}>To konto ({session.name}) nie ma uprawnień terapeuty.</p>
          <a href="/" className="inline-block px-5 py-2.5 rounded-full text-sm" style={{ background: "#26312F", color: "#fff", fontWeight: 700 }}>Wróć do strony</a>
        </div>
      </div>
    );
  }
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // pełne dane rezerwacji — wypełniane dopiero dla admina (RLS i tak by odrzuciło pozostałych)
  const [bookings, setBookings] = useState([]);
  // publiczna, "okrojona" dostępność terminów — widoczna dla każdego (przez get_taken_slots)
  const [takenSlots, setTakenSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);

  // ---- sesja: odczyt + nasłuch zmian logowania ----
  useEffect(() => {
    async function loadSession(authUser) {
      if (!authUser) {
        setSession(null);
        setSessionLoading(false);
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", authUser.id).single();
      setSession({
        id: authUser.id,
        email: authUser.email,
        role: profile?.role || "client",
        name: profile?.full_name || authUser.email.split("@")[0],
      });
      setSessionLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => loadSession(data.session?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      loadSession(sessionData?.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ---- dostępność terminów (publiczne, bez danych osobowych) ----
  const refreshAvailability = useCallback(async () => {
    const [{ data: taken }, { data: blocked }] = await Promise.all([
      supabase.rpc("get_taken_slots"),
      supabase.from("blocked_slots").select("date, time"),
    ]);
    setTakenSlots(taken || []);
    setBlockedSlots(blocked || []);
  }, []);

  useEffect(() => {
    refreshAvailability();
  }, [refreshAvailability]);

  // ---- pełne rezerwacje dla panelu admina ----
  const refreshBookings = useCallback(async () => {
    const { data, error } = await supabase.from("bookings").select("*").order("date", { ascending: true }).order("time", { ascending: true });
    if (!error) setBookings((data || []).map(mapBookingRow));
  }, []);

  useEffect(() => {
    if (session?.role === "admin") refreshBookings();
  }, [session, refreshBookings]);

  function handleLogin(user) {
    setSession(user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  async function addBooking(booking) {
    const { error } = await supabase.from("bookings").insert({
      client_name: booking.clientName,
      client_email: booking.clientEmail,
      client_phone: booking.clientPhone || null,
      service: booking.service,
      form: booking.form,
      date: booking.date,
      time: booking.time,
      status: "oczekuje",
    });
    if (error) {
      alert("Nie udało się zapisać rezerwacji: " + error.message);
      return;
    }
    refreshAvailability();
    if (session?.role === "admin") refreshBookings();

    // e-mail do klienta (i do terapeutki) o nowej rezerwacji — błąd wysyłki
    // nie blokuje rezerwacji, więc tylko logujemy go w konsoli
    supabase.functions.invoke("send-booking-email", { body: { type: "new", booking } }).catch((e) => console.warn("Nie udało się wysłać e-maila:", e));
  }

  async function updateBookingStatus(id, status) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      alert("Nie udało się zaktualizować rezerwacji: " + error.message);
      return;
    }
    const affectedBooking = bookings.find((b) => b.id === id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    refreshAvailability();

    if (affectedBooking) {
      supabase.functions.invoke("send-booking-email", { body: { type: status, booking: affectedBooking } }).catch((e) => console.warn("Nie udało się wysłać e-maila:", e));
    }
  }

  async function toggleBlockedSlot(date, time) {
    const exists = blockedSlots.some((s) => s.date === date && s.time === time);
    if (exists) {
      const { error } = await supabase.from("blocked_slots").delete().eq("date", date).eq("time", time);
      if (error) return alert("Nie udało się odblokować terminu: " + error.message);
    } else {
      const { error } = await supabase.from("blocked_slots").insert({ date, time });
      if (error) return alert("Nie udało się zablokować terminu: " + error.message);
    }
    refreshAvailability();
  }

  function isSlotUnavailable(date, time) {
    const blocked = blockedSlots.some((s) => s.date === date && s.time === time);
    const taken = takenSlots.some((s) => s.date === date && s.time === time);
    return blocked || taken;
  }

  return (
    <Routes>
      <Route element={<Layout session={session} onLogout={handleLogout} addBooking={addBooking} isSlotUnavailable={isSlotUnavailable} />}>
        <Route index element={<Home />} />
        <Route path="o-mnie" element={<About />} />
        <Route path="oferta" element={<Offer />} />
        <Route path="rezerwacja" element={<Booking />} />
        <Route path="kontakt" element={<Contact />} />
        <Route path="profil" element={<Profile />} />
      </Route>

      <Route path="login" element={<LoginPage onLogin={handleLogin} />} />

      <Route
        path="admin"
        element={
          <RequireAdmin session={session} sessionLoading={sessionLoading}>
            <AdminLayout session={session} onLogout={handleLogout} bookings={bookings} blockedSlots={blockedSlots} updateBookingStatus={updateBookingStatus} toggleBlockedSlot={toggleBlockedSlot} />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="przeglad" replace />} />
        <Route path="przeglad" element={<AdminOverview />} />
        <Route path="grafik" element={<AdminSchedule />} />
        <Route path="klienci" element={<AdminClients />} />
        <Route path="uslugi" element={<AdminServices />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
