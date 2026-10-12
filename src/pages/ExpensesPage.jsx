import { useMemo, useState } from 'react';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseTable from '../components/ExpenseTable';
import { formatINR } from '../utils/helpers';

const NO_FILTERS = { search: '', category: 'All', from: '', to: '' };

export default function ExpensesPage({ expenses, onEdit, onDelete }) {
  const [filters, setFilters] = useState(NO_FILTERS);

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return expenses.filter((e) => {
      if (term && !e.title.toLowerCase().includes(term)) return false;
      if (filters.category !== 'All' && e.category !== filters.category) return false;
      if (filters.from && e.date < filters.from) return false;
      if (filters.to && e.date > filters.to) return false;
      return true;
    });
  }, [expenses, filters]);

  const filteredTotal = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="card">
      <ExpenseFilters
        filters={filters}
        onChange={(field, value) => setFilters((f) => ({ ...f, [field]: value }))}
        onClear={() => setFilters(NO_FILTERS)}
      />

      <div className="result-summary">
        Showing {filtered.length} of {expenses.length} expenses · Total {formatINR(filteredTotal)}
      </div>

      {filtered.length === 0 ? (
        <div className="no-match">
          <p className="muted">No expenses match these filters.</p>
          <button className="btn btn-secondary btn-sm" onClick={() => setFilters(NO_FILTERS)}>
            Clear filters
          </button>
        </div>
      ) : (
        <ExpenseTable expenses={filtered} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
}
