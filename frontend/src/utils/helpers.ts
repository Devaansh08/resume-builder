// ─── General Utilities ─────────────────────────────────────────────────────

/** Generate a UUID v4 */
export const uuidv4 = (): string => crypto.randomUUID();

/** Debounce a function */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Clamp a number between min and max */
export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

/** Format a date string to "Month Year" */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + '-01');
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/** Merge classnames */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Truncate text */
export const truncate = (text: string, length: number): string =>
  text.length > length ? text.slice(0, length) + '...' : text;

/** Split comma-separated string into array */
export const toArray = (val: string): string[] =>
  val.split(',').map((s) => s.trim()).filter(Boolean);

/** Count words in a string */
export const wordCount = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length;

/** Format URL to ensure valid http/https protocol */
export const formatUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) return trimmed;
  return `https://${trimmed}`;
};

/** Generate initials from a name */
export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

/** Relative time formatter */
export const timeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/** Copy text to clipboard */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
