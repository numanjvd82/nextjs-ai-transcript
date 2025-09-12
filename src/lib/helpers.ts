/**
 * Creates a query string from the current search params and parameters to update
 */
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

// Initialize dayjs plugins
dayjs.extend(duration);

export function createQueryString({
  searchParams,
  paramsToUpdate,
}: {
  searchParams: URLSearchParams;
  paramsToUpdate: Array<{ key: string; value: string }>;
}) {
  // Create a new URLSearchParams object with the current search parameters
  const newSearchParams = new URLSearchParams(searchParams.toString());

  // Update or add new parameters
  paramsToUpdate.forEach(({ key, value }) => {
    newSearchParams.set(key, value);
  });

  // Convert to string and add the ? prefix
  const queryString = newSearchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Format seconds to MM:SS format
 */
export function formatTime(timeInSeconds: number | null | undefined): string {
  // Handle invalid values
  if (
    timeInSeconds === null ||
    timeInSeconds === undefined ||
    isNaN(timeInSeconds)
  ) {
    return "00:00";
  }

  return dayjs.duration(timeInSeconds, "seconds").format("mm:ss");
}

/**
 * Format a date to standard format
 */
export function formatDate(
  date: string | Date,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string {
  return dayjs(date).format(format);
}

/**
 * Get the current year
 */
export function getCurrentYear(): number {
  return dayjs().year();
}

/**
 * Get a date object representing the Unix epoch (Jan 1, 1970)
 */
export function getEpochDate(): Date {
  return dayjs(0).toDate();
}
