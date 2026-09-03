/**
 * Formats an ISO date string for display using the runtime's locale date
 * format. Falls back to the original string unchanged when it isn't a
 * parseable date, rather than rendering "Invalid Date".
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString();
}
