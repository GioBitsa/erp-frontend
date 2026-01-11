import { formatDistanceToNow, format } from "date-fns";

export function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;

  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === "string") {
    const d = new Date(value); // ISO-safe
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export function formatRelativeDate(
  value: unknown,
  options?: { withSuffix?: boolean }
): { relative: string; exact: string } {
  const date = toDate(value);

  if (!date) {
    return {
      relative: String(value ?? ""),
      exact: "",
    };
  }

  return {
    relative: formatDistanceToNow(date, {
      addSuffix: options?.withSuffix ?? true,
    }),
    exact: format(date, "PP"),
  };
}

/** Formats a date like "Jan 5, 2026" (date-fns: "PP") */
export function formatDate(value: unknown, fallback = ""): string {
  const date = toDate(value);
  if (!date) return fallback || String(value ?? "");
  return format(date, "PP");
}

/** Formats a date-time like "Jan 5, 2026 at 12:30 PM" (date-fns: "PPp") */
export function formatDateTime(value: unknown, fallback = ""): string {
  const date = toDate(value);
  if (!date) return fallback || String(value ?? "");
  return format(date, "PPp");
}
