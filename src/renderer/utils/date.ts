export function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function expiresInWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return d <= weekFromNow;
}
