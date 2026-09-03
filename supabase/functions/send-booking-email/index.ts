// Supabase Edge Function: send-booking-email
// Wysyła e-mail do klienta (zawsze) i do terapeutki (tylko przy nowej rezerwacji),
// korzystając z Resend (https://resend.com).
//
// Wdrożenie: Supabase Dashboard → Edge Functions → New function → nazwa:
// "send-booking-email" → wklej ten kod → Deploy.
// Sekrety (Edge Functions → Secrets): RESEND_API_KEY, THERAPIST_EMAIL,
// opcjonalnie BOOKING_FROM_EMAIL.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("BOOKING_FROM_EMAIL") || "Harmonia <onboarding@resend.dev>";
const THERAPIST_EMAIL = Deno.env.get("THERAPIST_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { type, booking } = await req.json();
    // type: "new" | "potwierdzona" | "odwołana"

    let subject = "";
    let html = "";

    if (type === "new") {
      subject = "Rezerwacja przyjęta — oczekuje na potwierdzenie";
      html = `<p>Cześć ${booking.clientName},</p>
        <p>Otrzymaliśmy Twoją rezerwację: <strong>${booking.service}</strong> (${booking.form}),
        ${booking.date} o ${booking.time}.</p>
        <p>Status: <strong>oczekuje na potwierdzenie</strong> przez terapeutkę.
        Dostaniesz kolejnego maila, gdy zostanie zatwierdzona.</p>`;
    } else if (type === "potwierdzona") {
      subject = "Twoja sesja została potwierdzona ✅";
      html = `<p>Cześć ${booking.clientName},</p>
        <p>Twoja sesja <strong>${booking.service}</strong> (${booking.form})
        w dniu ${booking.date} o ${booking.time} została <strong>potwierdzona</strong>. Do zobaczenia!</p>`;
    } else if (type === "odwołana") {
      subject = "Twoja rezerwacja została odwołana";
      html = `<p>Cześć ${booking.clientName},</p>
        <p>Niestety Twoja rezerwacja <strong>${booking.service}</strong>
        w dniu ${booking.date} o ${booking.time} została odwołana.
        Napisz do nas, aby ustalić nowy termin.</p>`;
    } else {
      throw new Error("Nieznany typ powiadomienia: " + type);
    }

    await sendEmail(booking.clientEmail, subject, html);

    if (type === "new" && THERAPIST_EMAIL) {
      await sendEmail(
        THERAPIST_EMAIL,
        "Nowa rezerwacja oczekuje na potwierdzenie",
        `<p>${booking.clientName} (${booking.clientEmail}, ${booking.clientPhone || "brak telefonu"})
         zarezerwował(a) <strong>${booking.service}</strong> (${booking.form})
         na ${booking.date} o ${booking.time}.</p>`
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
