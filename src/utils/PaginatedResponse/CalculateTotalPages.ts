export function calculateTotalPages(
  dataItem: number,
  validLimitParams: number,
) {
  return Math.ceil(dataItem / validLimitParams);
}
