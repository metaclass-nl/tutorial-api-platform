/**
 * Input formatting and normalization functions.
 */

/**
 * Format function for input type=date
 * Without time correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string to be formatted
 * @returns string formatted as a proper value for the input
 */
export function formatDate(v) {
    if (!v) return undefined;
    return v.substring(0, 10);
}

/**
 * Normalization function for input type=date
 * Without time correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string to be normalized, a value from the input
 * @returns string normalized as a proper value for api platform
 */
export function normalizeDate(v) {
    if (!v) return null;
    return  v + 'T00:00:00.000Z';
}

/**
 * Format function for input type=time
 * Without date correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string to be formatted
 * @returns string formatted as a proper value for the input
 */
export function formatTime(v) {
    if (!v) return undefined;
    return v.substring(11, 19);
}

/**
 * Normalization function for input type=time
 * Without date correct conversion between local time and UTC is impossable
 * so time zones are ignoored.
 * @param v string to be normalized, a value from the input
 * @returns string normalized as a proper value for api platform
 */
export function normalizeTime(v) {
    if (!v) return null;
    return '1970-01-01T' + v + (v.length === 5 ? ':00.000Z' : '.000Z')
}

/**
 * Format function for input type=datetime-local
 * @param v string to be formatted
 * @returns string formatted as a proper value for the input
 */
export function  formatDateTime(v) {
    if (!v) return undefined;
    const dt = new Date(v);
    return dt.getFullYear()+ '-' + ('0' + (dt.getMonth()+1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2) + 'T' + dt.toLocaleTimeString('en-GB')
}

/**
 * Normalization function for input type=datetime-local
 * @param v string to be normalized, a value from the input
 * @returns string normalized as a proper value for api platform
 */
export function normalizeDateTime(v) {
    if (!v || v.length < 16) return null;
    return new Date(
        parseInt(v.substring(0, 4), 10), parseInt(v.substring(5, 7), 10) - 1,
        parseInt(v.substring(8, 10), 10), parseInt(v.substring(11, 13), 10),
        parseInt(v.substring(14, 16), 10), 0
    ).toISOString()
}

/**
 * Format function for input type=number
 * @param v string to be formatted
 * @returns string formatted as a proper value for the input
 */
export function formatNumber(v) {
    return v+"";
}

/**
 * Normalization function for input type=number
 * @param v string to be normalized, a value from the input
 * @returns string normalized as a proper value for api platform
 */
export function normalizeNumber(v) {
    if (!v) return null;
    return parseFloat(v);
}
