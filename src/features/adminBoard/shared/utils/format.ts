/**
 * Formats an ISO timestamp into a compact relative label, e.g. "3h ago".
 * Falls back gracefully for invalid dates.
 */
export function formatRelativeTime(iso: string): string {
  const timestamp = new Date(iso).getTime();

  if (Number.isNaN(timestamp)) return "—";

  const seconds = Math.round((Date.now() - timestamp) / 1000);
  const future = seconds < 0;
  const abs = Math.abs(seconds);

  const units: [limit: number, divisor: number, suffix: string][] = [
    [60, 1, "s"],
    [3600, 60, "m"],
    [86400, 3600, "h"],
    [604800, 86400, "d"],
    [2629800, 604800, "w"],
    [31557600, 2629800, "mo"],
    [Infinity, 31557600, "y"],
  ];

  for (const [limit, divisor, suffix] of units) {
    if (abs < limit) {
      const amount = Math.max(1, Math.floor(abs / divisor));
      return future ? `in ${amount}${suffix}` : `${amount}${suffix} ago`;
    }
  }

  return "—";
}

/** Formats a number with thousands separators. */
export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
