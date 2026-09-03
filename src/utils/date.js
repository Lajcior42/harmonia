export function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// Klucz w formacie YYYY-MM-DD, wspólny dla rezerwacji klienta i grafiku admina
export function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export function formatShort(d) {
  const DAY_LABELS = ["Ndz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];
  return `${DAY_LABELS[d.getDay()]}, ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}
