const TIME_ZONE = "Europe/Istanbul";

export function formatDate(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(iso));
}

/** Sadece tarih ("2026-10-03") olan sütunlar için; saat dilimi kaymasın diye öğlen kabul edilir. */
export function formatDay(day: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(`${day.slice(0, 10)}T12:00:00Z`));
}

/** Türk lirası: küsurat varsa kuruşuyla, yoksa tam sayı. */
export function formatMoney(amount: number | string | null | undefined) {
  const value = Number(amount ?? 0);
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Bugünün tarihi (İstanbul saatiyle) "YYYY-MM-DD" biçiminde. */
export function todayInIstanbul() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" }).format(
    new Date(iso),
  );
}

/** Takvim yaprağı görünümü için gün / kısa ay / hafta günü */
export function dateParts(iso: string) {
  const date = new Date(iso);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("tr-TR", { timeZone: TIME_ZONE, ...options }).format(date);
  return {
    day: part({ day: "numeric" }),
    month: part({ month: "short" }),
    weekday: part({ weekday: "long" }),
  };
}

/** ISO tarihini <input type="datetime-local"> değerine çevirir (tarayıcının saat diliminde). */
export function isoToLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function localInputToIso(value: string) {
  return value ? new Date(value).toISOString() : null;
}
