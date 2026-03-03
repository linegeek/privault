function getDateIngnoringTz(str: string) {
  const d = new Date(str);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function compareDate(a: Date, b: Date) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());

  return da.getTime() - db.getTime();
}

export function isExpired(dateStr: string): boolean {
  return compareDate(getDateIngnoringTz(dateStr), new Date()) < 0;
}

export function expiresInWeek(dateStr: string): boolean {
  const d = getDateIngnoringTz(dateStr);
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return compareDate(d, weekFromNow) < 0;
}

export function expiresInDays(dateStr: string, days: number): boolean {
  const d = getDateIngnoringTz(dateStr);
  const now = new Date();
  const dayFromNow = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return compareDate(d, dayFromNow) < 0;
}
