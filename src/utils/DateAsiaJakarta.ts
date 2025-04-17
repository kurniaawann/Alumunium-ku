import { format as formatTz, toZonedTime } from 'date-fns-tz';

/**
 * Fungsi untuk mengonversi tanggal ke zona waktu tertentu dan memformatnya dalam format ISO 8601
 * @param date - Tanggal dalam bentuk Date atau string ISO 8601
 * @param timeZone - Zona waktu target (default: Asia/Jakarta)
 * @returns {string} - Format tanggal dalam bentuk ISO 8601 dengan offset
 */
export function formatDateTimeToTimeZone(
  date: Date | string,
  timeZone: string = 'Asia/Jakarta',
): string {
  if (!date) return null; // Handle jika data kosong/null
  const zonedDate = toZonedTime(date, timeZone);
  return formatTz(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone });
}
