export default function EmptyState({ isDemo, onAdd, onLoadSample }) {
  return (
    <div className="card empty">
      <div className="empty-icon" aria-hidden="true">₹</div>
      <h2>No expenses yet</h2>
      <p className="muted">Add your first expense to see your totals and spending chart here.</p>
      <div className="empty-actions">
        <button className="btn btn-primary" onClick={onAdd}>
          + Add expense
        </button>
        {isDemo && (
          <button className="btn btn-secondary" onClick={onLoadSample}>
            Load sample data
          </button>
        )}
      </div>
    </div>
  );
}
