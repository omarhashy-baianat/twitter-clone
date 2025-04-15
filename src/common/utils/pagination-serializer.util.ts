export function paginationSerializer<T>(
  page: number,
  limit: number,
  totalCount: number,
  items: T[],
) {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNext = page != totalPages;
  const hasPrevious = page != 1;
  return {
    items,
    pageInfo: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext,
      hasPrevious,
    },
  };
}
