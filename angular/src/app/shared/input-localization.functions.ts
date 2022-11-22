/**
 * Input formatting and normalization functions.
 */

/**
 * Format function for input type=date
 * Without time correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string|undefined to be formatted
 * @returns string formatted as a proper value for the input
 */
export function formatDate(v?: string) {
  if (!v || !v.substring) return "";

  return v.substring(0, 10);
}

/**
 * Normalization function for input type=date
 * Without time correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string|null|undefined to be normalized, a value from the input
 * @returns string|null normalized as a proper value for api platform
 */
export function normalizeDate(v?: string|null) {
  if (!v) return null;
  return v + ""; // + 'T00:00:00.000Z';
}

/**
 * Format function for input type=time
 * Without date correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string|undefined to be formatted
 * @returns string formatted as a proper value for the input
 */
export function formatTime(v?: string) {
  if (!v || !v.substring) return "";
  return v.substring(11, 19);
}

/**
 * Normalization function for input type=time
 * Without date correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string|null|undefined to be normalized, a value from the input
 * @returns string|null normalized as a proper value for api platform
 */
export function normalizeTime(v?: string|null) {
  if (!v) return null;
  return "1970-01-01T" + v + (v.length === 5 ? ":00.000Z" : ".000Z");
}

/**
 * Format function for input type=datetime-local
 * If to render serverside the (normalized) string to be formatted is
 * returned unchanged assuming it includes timezone/offset
 * @param v string|undefined  to be formatted
 * @param serverside boolean Wheather to render serverside
 * @returns string formatted as a proper value for the input
 */
export function formatDateTime(v?: string, serverside = false) {
  if (!v || !v.substring) return "";
  if (typeof window === "undefined") {
    return serverside ? v : "";
  }

  const dt = new Date(v);
  return (
    dt.getFullYear() +
    "-" +
    ("0" + (dt.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + dt.getDate()).slice(-2) +
    "T" +
    dt.toLocaleTimeString("en-GB")
  );
}

/**
 * Normalization function for input type=datetime-local
 * @param v string to be normalized, a value from the input
 * @returns string|null normalized as a proper value for api platform
 */
export function normalizeDateTime(v?: string|null) {
  if (!v || v.length < 16) return null;
  return new Date(
    parseInt(v.substring(0, 4), 10),
    parseInt(v.substring(5, 7), 10) - 1,
    parseInt(v.substring(8, 10), 10),
    parseInt(v.substring(11, 13), 10),
    parseInt(v.substring(14, 16), 10),
    0
  ).toISOString();
}

/**
 * Format function for input type=number
 * @param v number|null|undefined to be formatted
 * @returns string formatted as a proper value for the input
 */
export function formatNumber(v?: number|null) {
  return v + "";
}

/**
 * Normalization function for input type=number
 * @param v string to be normalized, a value from the input
 * @returns number|null normalized as a proper value for api platform
 */
export function normalizeNumber(v?: string) {
  if (!v) return null;
  return parseFloat(v);
}


