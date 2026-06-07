function getPageList(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
}

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pageList = getPageList(page, totalPages);
  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  return (
    <nav className="pagination-bar" aria-label="Pagination">
      <button
        type="button"
        className="pagination-bar__btn"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>

      <ul className="pagination-bar__pages">
        {pageList.map((p, idx) => {
          const prev = pageList[idx - 1];
          const gap = prev && p - prev > 1;
          return (
            <li key={p} className="d-flex align-items-center">
              {gap && <span className="pagination-bar__ellipsis" aria-hidden="true">…</span>}
              <button
                type="button"
                className={`pagination-bar__page${p === page ? ' pagination-bar__page--active' : ''}`}
                onClick={() => go(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="pagination-bar__btn"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  );
}
