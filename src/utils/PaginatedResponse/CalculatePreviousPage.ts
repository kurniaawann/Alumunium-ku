export function calculatePreviousPage(currentPage: number) {
  return currentPage > 1 ? currentPage - 1 : null;
}
