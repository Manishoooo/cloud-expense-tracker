import { formatINR } from '../utils/helpers';

export default function ConfirmDialog({ expense, busy, onConfirm, onCancel }) {
  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="modal modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">Delete this expense?</h2>
        <p className="muted">
          “{expense.title}” ({formatINR(expense.amount)}) will be permanently deleted. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
