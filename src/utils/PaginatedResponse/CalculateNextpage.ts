export function calculateNextPage(currentPage: number, totalPages: number) {
  return currentPage < totalPages ? currentPage + 1 : null;
}
