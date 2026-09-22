const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function buildPageNumbers(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) return [1, 2, 3, 4, 5];
  if (currentPage >= totalPages - 2) {
    return Array.from({ length: 5 }, (_, index) => totalPages - 4 + index);
  }

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

function TicketPagination({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  startItem,
  endItem,
  onPageChange,
  onPageSizeChange,
}) {
  const pageNumbers = buildPageNumbers(currentPage, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="mt-5 bg-white border border-slate-200 rounded-xl px-4 py-4 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-slate-500">
        {totalItems > 0
          ? `Showing ${startItem}-${endItem} of ${totalItems} tickets`
          : 'Showing 0 tickets'}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <span>Tickets per page:</span>
          <select
            value={pageSize}
            onChange={onPageSizeChange}
            className="px-2.5 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
            aria-label="Tickets per page"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`min-w-9 px-3 py-2 text-sm font-medium rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                page === currentPage
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLastPage}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}

export default TicketPagination;
