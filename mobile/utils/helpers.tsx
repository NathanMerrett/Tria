// utils/helpers.ts

export const getInitials = (name: string | null | undefined): string => {
  // Check if the name is "falsy" (null, undefined, empty string) or not a string.
  // The `!name` check handily covers null, undefined, and ''.
  if (!name || typeof name !== 'string') {
    return '?';
  }

  const parts = name.trim().split(' ');
  const initials = parts
    .map(part => part[0]) // Get the first character of each part
    .filter(Boolean)      // Filter out any empty parts that might result from multiple spaces
    .slice(0, 2)          // Take the first two initials
    .join('');

  return initials.toUpperCase();
};

export function nextMonday(from = new Date()) {
  const d = new Date(from);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const diff = (8 - (day === 0 ? 7 : day)) % 7; // days until Mon
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff)); // prefer next Monday, not today
  d.setHours(0,0,0,0);
  return d;
}

export function weeksBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime();
  return Math.max(0, Math.ceil(ms / (7 * 24 * 3600 * 1000)));
}

export function addWeeks(date: Date, weeks: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  d.setHours(23,59,59,999);
  return d;
}

export function fmtDate(d?: Date) {
  if (!d) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
