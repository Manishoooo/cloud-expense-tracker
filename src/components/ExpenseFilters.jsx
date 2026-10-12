import { CATEGORIES } from '../utils/helpers';

export default function ExpenseFilters({ filters, onChange, onClear }) {
  const hasFilters = filters.search || filters.category !== 'All' || filters.from || filters.to;

  return (
    <div className="filters">
      <div className="filter-row">
        <div className="field grow">
          <label htmlFor="search">Search by title</label>
          <input
            id="search"
            type="search"
            placeholder="e.g. lunch"
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="from">From date</label>
          <input id="from" type="date" value={filters.from} onChange={(e) => onChange('from', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="to">To date</label>
          <input id="to" type="date" value={filters.to} onChange={(e) => onChange('to', e.target.value)} />
        </div>
      </div>

      <div className="chips" role="group" aria-label="Filter by category">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={`chip ${filters.category === c ? 'active' : ''}`}
            onClick={() => onChange('category', c)}
            aria-pressed={filters.category === c}
          >
            {c}
          </button>
        ))}
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
