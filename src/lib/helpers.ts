/**
 * Creates a query string from the current search params and parameters to update
 */
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
