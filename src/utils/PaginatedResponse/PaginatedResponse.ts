export function createPaginatedResponse({
  data,
  totalData,
  totalPages,
  currentPage,
  nextPage,
  limit,
  previousPage,
}: PaginatedResponse) {
  // const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  // const previousPage = currentPage > 1 ? currentPage - 1 : null;
  return {
    data: data,
    totalData,
    totalPages,
    currentPage,
    nextPage,
    previousPage,
    limit,
  };
}

interface PaginatedResponse {
  data: object;
  totalData: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  nextPage: number | null;
  previousPage: number | null;
}
