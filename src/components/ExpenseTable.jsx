import { CATEGORY_COLORS, formatDate, formatINR } from '../utils/helpers';

// A table on desktop; each row becomes a card on mobile (see index.css).
export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th className="num">Amount</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td data-label="Date">{formatDate(e.date)}</td>
              <td data-label="Title">
                <div className="t-title">{e.title}</div>
                {e.description && <div className="t-desc">{e.description}</div>}
              </td>
              <td data-label="Category">
                <span className="badge">
                  <span className="dot" style={{ background: CATEGORY_COLORS[e.category] || '#64748b' }} />
                  {e.category}
                </span>
              </td>
              <td data-label="Amount" className="num amount">
                {formatINR(e.amount)}
              </td>
              <td className="actions-cell">
                <div className="actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(e)}>
                    Edit
                  </button>
                  <button className="btn btn-danger-outline btn-sm" onClick={() => onDelete(e)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
