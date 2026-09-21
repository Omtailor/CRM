/**
 * Centralized date formatting utility.
 *
 * Strategy: the API always returns ISO 8601 timestamps with a 'Z' suffix
 * (e.g. "2026-09-21T19:20:52Z"), meaning they are unambiguously UTC.
 * `new Date("...Z")` parses as UTC in every browser, and the Intl.DateTimeFormat
 * options below let the browser convert to the user's local timezone automatically -
 * no hardcoded offsets, no manual arithmetic.
 *
 * Example:
 *   "2026-09-21T19:20:52Z"  (UTC)
 *   -> Sep 22, 2026, 12:50 AM  (IST, UTC+5:30)
 *   -> Sep 21, 2026, 03:20 PM  (EDT, UTC-4)
 */

/**
 * Format a UTC ISO 8601 timestamp string into the user's local time.
 *
 * @param {string|null|undefined} isoString - ISO 8601 string, preferably with 'Z' suffix.
 * @returns {string} Formatted date-time in the browser's local timezone (12-hour clock).
 */
export function formatDateTime(isoString) {
  if (!isoString) return 'N/A';

  const date = new Date(isoString);

  // Guard against invalid values coming from the API
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
