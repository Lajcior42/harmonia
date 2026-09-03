import { useState, useMemo } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { Clock, Check, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft as ArrowLeftIcon, CalendarPlus } from "lucide-react";
import { COLORS } from "../theme.js";
import { SERVICES, FORMS } from "../data/services.js";
import { addDays, dateKey, formatShort } from "../utils/date.js";

function SectionLabel({ children, color }) {
  return <p className="text-xs uppercase mb-2" style={{ color: color || COLORS.gold, letterSpacing: "0.14em", fontWeight: 700 }}>{children}</p>;
}

const DAY_LABELS = ["Ndz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];
const TIME_SLOTS = ["9:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00"];
const BOOKING_STEPS = ["Sesja", "Forma", "Termin", "Podsumowanie"];

function buildDays(startOffset, count) {
  const days = [];
  for (let i = startOffset; i < startOffset + count; i++) days.push(addDays(i));
  return days;
}

function BookingProgress({ currentStep }) {
  return (
    <div className="flex items-center mb-9">
      {BOOKING_STEPS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                style={{ background: done ? COLORS.mint : active ? COLORS.gold : COLORS.surface, color: done || active ? "#fff" : COLORS.textMuted, border: `1px solid ${done ? COLORS.mint : active ? COLORS.gold : COLORS.lineStrong}`, fontWeight: 700, boxShadow: active ? `0 0 0 5px rgba(201,164,76,0.18)` : "none" }}>
                {done ? <Check size={15} strokeWidth={3} /> : stepNum}
              </div>
              <span className="text-[11px] mt-1.5 hidden sm:block" style={{ color: active ? COLORS.ink : COLORS.textMuted, fontWeight: active ? 700 : 400 }}>{label}</span>
            </div>
            {stepNum !== BOOKING_STEPS.length && <div className="flex-1 h-[2px] mx-2 rounded-full transition-all duration-300" style={{ background: done ? COLORS.mint : COLORS.lineStrong }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function Booking() {
  const { session, addBooking, isSlotUnavailable } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const preselected = location.state?.serviceId || null;

  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preselected);
  const [selectedForm, setSelectedForm] = useState(null);
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [customer, setCustomer] = useState({ name: session?.name || "", email: session?.email || "", phone: "" });

  const visibleDays = useMemo(() => buildDays(dayOffset, 7), [dayOffset]);
  const selectedServiceObj = SERVICES.find((s) => s.id === selectedService);

  function handleFinalConfirm() {
    if (!selectedService || !selectedForm || !selectedDate || !selectedTime || !customer.name || !customer.email) return;
    if (selectedForm === "Na odległość" && !customer.phone) return;
    addBooking({
      clientName: customer.name,
      clientEmail: customer.email,
      clientPhone: customer.phone,
      service: selectedServiceObj?.title,
      form: selectedForm,
      date: dateKey(selectedDate),
      time: selectedTime,
    });
    setConfirmed(true);
  }

  if (confirmed && selectedDate) {
    return (
      <div className="fade-in flex flex-col items-center text-center pt-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: COLORS.mint, color: "#fff" }}>
          <Check size={28} strokeWidth={2.5} />
        </div>
        <SectionLabel color={COLORS.mintDark}>Wizyta potwierdzona</SectionLabel>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 28 }} className="mb-2">Do zobaczenia!</h1>
        <p className="text-sm mb-8" style={{ color: COLORS.textMuted }}>Status rezerwacji: <strong>oczekuje na potwierdzenie</strong> przez terapeutkę.</p>

        <div className="w-full max-w-sm rounded-2xl p-6 mb-6 text-left" style={{ background: COLORS.surface, border: `1px solid ${COLORS.line}` }}>
          <div className="flex justify-between text-sm py-2" style={{ borderBottom: `1px solid ${COLORS.line}` }}><span style={{ color: COLORS.textMuted }}>Usługa</span><span style={{ fontWeight: 700 }}>{selectedServiceObj?.title}</span></div>
          <div className="flex justify-between text-sm py-2" style={{ borderBottom: `1px solid ${COLORS.line}` }}><span style={{ color: COLORS.textMuted }}>Forma</span><span style={{ fontWeight: 700 }}>{selectedForm}</span></div>
          <div className="flex justify-between text-sm py-2" style={{ borderBottom: `1px solid ${COLORS.line}` }}><span style={{ color: COLORS.textMuted }}>Termin</span><span style={{ fontWeight: 700 }}>{formatShort(selectedDate)}, {selectedTime}</span></div>
          <div className="flex justify-between text-sm py-2"><span style={{ color: COLORS.textMuted }}>Koszt</span><span style={{ fontWeight: 700 }}>{selectedServiceObj?.price}</span></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm" style={{ background: COLORS.surface, border: `1px solid ${COLORS.lineStrong}`, color: COLORS.ink, fontWeight: 700 }}>
            <CalendarPlus size={15} /> Dodaj do kalendarza
          </button>
          <button onClick={() => navigate("/")} className="glow-btn flex-1 py-3 rounded-full text-sm" style={{ background: COLORS.ink, color: "#fff", fontWeight: 700 }}>Wróć do strony głównej</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <SectionLabel>Rezerwacja</SectionLabel>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30 }} className="mb-7">Umów termin sesji</h1>
      <BookingProgress currentStep={bookingStep} />

      {bookingStep === 1 && (
        <div className="fade-in">
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted, fontWeight: 600 }}>Jaki rodzaj sesji Cię interesuje?</p>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedService === s.id;
              return (
                <button key={s.id} onClick={() => setSelectedService(s.id)} className="glow-card text-left rounded-2xl p-5 flex flex-col"
                  style={{ background: isSelected ? `${COLORS.gold}14` : COLORS.surface, border: `2px solid ${isSelected ? COLORS.gold : COLORS.line}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: isSelected ? COLORS.gold : `${COLORS.gold}15`, color: isSelected ? "#fff" : COLORS.gold }}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16 }} className="mb-1">{s.title}</p>
                  <p className="text-xs mb-2" style={{ color: COLORS.textMuted }}>{s.duration} · {s.price}</p>
                  <p className="text-xs" style={{ color: COLORS.textMuted, lineHeight: 1.5 }}>{s.description}</p>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button onClick={() => selectedService && setBookingStep(2)} disabled={!selectedService} className="glow-btn flex items-center gap-2 px-6 py-3 rounded-full text-sm"
              style={{ background: selectedService ? COLORS.gold : COLORS.lineStrong, color: selectedService ? "#fff" : COLORS.textMuted, fontWeight: 700, cursor: selectedService ? "pointer" : "not-allowed" }}>
              Dalej: Forma sesji <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {bookingStep === 2 && (
        <div className="fade-in">
          <p className="text-sm mb-4" style={{ color: COLORS.textMuted, fontWeight: 600 }}>Jak chcesz odbyć sesję?</p>
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            {FORMS.map((f) => {
              const Icon = f.icon;
              const isSelected = selectedForm === f.id;
              return (
                <button key={f.id} onClick={() => setSelectedForm(f.id)} className="glow-card text-left rounded-2xl p-5 flex items-start gap-4"
                  style={{ background: isSelected ? `${COLORS.gold}14` : COLORS.surface, border: `2px solid ${isSelected ? COLORS.gold : COLORS.line}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: isSelected ? COLORS.gold : `${COLORS.gold}15`, color: isSelected ? "#fff" : COLORS.gold }}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16 }} className="mb-1">{f.title}</p>
                    <p className="text-xs" style={{ color: COLORS.textMuted, lineHeight: 1.5 }}>{f.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setBookingStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm" style={{ color: COLORS.ink, border: `1px solid ${COLORS.lineStrong}`, fontWeight: 700 }}><ArrowLeftIcon size={15} /> Wstecz</button>
            <button onClick={() => selectedForm && setBookingStep(3)} disabled={!selectedForm} className="glow-btn flex items-center gap-2 px-6 py-3 rounded-full text-sm"
              style={{ background: selectedForm ? COLORS.gold : COLORS.lineStrong, color: selectedForm ? "#fff" : COLORS.textMuted, fontWeight: 700, cursor: selectedForm ? "pointer" : "not-allowed" }}>
              Dalej: Termin <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {bookingStep === 3 && (
        <div className="fade-in">
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm" style={{ color: COLORS.textMuted, fontWeight: 600 }}>Wybierz dzień</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setDayOffset((v) => Math.max(0, v - 7))} disabled={dayOffset === 0} className="w-7 h-7 flex items-center justify-center rounded-full" style={{ color: dayOffset === 0 ? "#D6D0C4" : COLORS.ink, background: COLORS.surface }}><ChevronLeft size={15} /></button>
                <button onClick={() => setDayOffset((v) => v + 7)} className="w-7 h-7 flex items-center justify-center rounded-full" style={{ color: COLORS.ink, background: COLORS.surface }}><ChevronRight size={15} /></button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {visibleDays.map((d) => {
                const isSunday = d.getDay() === 0;
                const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
                return (
                  <button key={d.toISOString()} disabled={isSunday} onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                    className="flex flex-col items-center justify-center rounded-2xl shrink-0"
                    style={{ width: 56, height: 68, background: isSelected ? COLORS.gold : COLORS.surface, border: `1px solid ${isSelected ? COLORS.gold : COLORS.line}`, color: isSunday ? "#D6D0C4" : isSelected ? "#fff" : COLORS.ink, cursor: isSunday ? "not-allowed" : "pointer" }}>
                    <span className="text-xs" style={{ opacity: 0.8 }}>{DAY_LABELS[d.getDay()]}</span>
                    <span className="text-lg" style={{ fontWeight: 700 }}>{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="mb-8">
              <p className="text-sm mb-3" style={{ color: COLORS.textMuted, fontWeight: 600 }}>Wybierz godzinę</p>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => {
                  const taken = isSlotUnavailable(dateKey(selectedDate), t);
                  const isSelected = selectedTime === t;
                  return (
                    <button key={t} disabled={taken} onClick={() => setSelectedTime(t)} className="py-2.5 rounded-xl text-sm"
                      style={{ background: isSelected ? COLORS.gold : COLORS.surface, border: `1px solid ${isSelected ? COLORS.gold : COLORS.line}`, color: taken ? "#D6D0C4" : isSelected ? "#fff" : COLORS.ink, textDecoration: taken ? "line-through" : "none", cursor: taken ? "not-allowed" : "pointer", fontWeight: isSelected ? 700 : 400 }}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setBookingStep(2)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm" style={{ color: COLORS.ink, border: `1px solid ${COLORS.lineStrong}`, fontWeight: 700 }}><ArrowLeftIcon size={15} /> Wstecz</button>
            <button onClick={() => selectedDate && selectedTime && setBookingStep(4)} disabled={!selectedDate || !selectedTime} className="glow-btn flex items-center gap-2 px-6 py-3 rounded-full text-sm"
              style={{ background: selectedDate && selectedTime ? COLORS.gold : COLORS.lineStrong, color: selectedDate && selectedTime ? "#fff" : COLORS.textMuted, fontWeight: 700, cursor: selectedDate && selectedTime ? "pointer" : "not-allowed" }}>
              Dalej: Podsumowanie <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {bookingStep === 4 && (
        <div className="fade-in">
          <div className="rounded-2xl p-5 mb-6" style={{ background: `${COLORS.mint}1A`, border: `1px solid ${COLORS.mint}44` }}>
            <p className="text-xs uppercase mb-2" style={{ color: COLORS.mintDark, letterSpacing: "0.1em", fontWeight: 700 }}>Podsumowanie</p>
            <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19 }} className="mb-1">{selectedServiceObj?.title}</p>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>{selectedForm} · {formatShort(selectedDate)} o {selectedTime} · {selectedServiceObj?.price}</p>
          </div>

          <p className="text-sm mb-3" style={{ color: COLORS.textMuted, fontWeight: 600 }}>Twoje dane</p>
          <div className="grid gap-3 mb-2">
            <input value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} placeholder="Imię i nazwisko" className="text-sm px-4 py-3 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}`, background: COLORS.surface }} />
            <input value={customer.email} onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))} placeholder="E-mail" type="email" className="text-sm px-4 py-3 rounded-xl outline-none" style={{ border: `1px solid ${COLORS.line}`, background: COLORS.surface }} />
            <input
              value={customer.phone}
              onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
              placeholder={selectedForm === "Na odległość" ? "Telefon (wymagany — WhatsApp)" : "Telefon (opcjonalnie)"}
              className="text-sm px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${selectedForm === "Na odległość" && !customer.phone ? COLORS.danger : COLORS.line}`, background: COLORS.surface }}
            />
          </div>
          {selectedForm === "Na odległość" && (
            <p className="text-xs mb-6" style={{ color: COLORS.goldDark }}>Sesja na odległość odbywa się przez WhatsApp — potrzebuję Twojego numeru telefonu, żeby się z Tobą połączyć.</p>
          )}
          {selectedForm !== "Na odległość" && <div className="mb-8" />}

          <div className="flex justify-between items-center">
            <button onClick={() => setBookingStep(3)} className="flex items-center gap-2 px-5 py-3 rounded-full text-sm" style={{ color: COLORS.ink, border: `1px solid ${COLORS.lineStrong}`, fontWeight: 700 }}><ArrowLeftIcon size={15} /> Wstecz</button>
            <button onClick={handleFinalConfirm} disabled={!customer.name || !customer.email || (selectedForm === "Na odległość" && !customer.phone)} className="glow-btn px-7 py-3 rounded-full text-sm"
              style={{
                background: customer.name && customer.email && !(selectedForm === "Na odległość" && !customer.phone) ? COLORS.gold : COLORS.lineStrong,
                color: customer.name && customer.email && !(selectedForm === "Na odległość" && !customer.phone) ? "#fff" : COLORS.textMuted,
                fontWeight: 700,
                cursor: customer.name && customer.email && !(selectedForm === "Na odległość" && !customer.phone) ? "pointer" : "not-allowed",
              }}>
              Potwierdzam i rezerwuję
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
