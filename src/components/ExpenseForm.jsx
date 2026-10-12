import { useState } from 'react';
import { CATEGORIES, friendlyError, todayISO, validateExpense } from '../utils/helpers';

// Modal form used for both adding and editing. Pass `expense` to edit.
export default function ExpenseForm({ expense, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: expense?.title ?? '',
    amount: expense ? String(expense.amount) : '',
    category: expense?.category ?? CATEGORIES[0],
    date: expense?.date ?? todayISO(),
    description: expense?.description ?? '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateExpense(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setSubmitError('');
    try {
      await onSubmit({
        title: form.title.trim(),
        amount: Math.round(Number(form.amount) * 100) / 100,
        category: form.category,
        date: form.date,
        description: form.description.trim(),
      });
      // On success the parent closes this form.
    } catch (err) {
      setSubmitError(friendlyError(err));
      setSaving(false);
    }
  }

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <h2 id="form-title">{expense ? 'Edit expense' : 'Add expense'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" type="text" maxLength={100} value={form.title} onChange={update('title')} autoFocus />
            {errors.title && <div className="field-error">{errors.title}</div>}
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                id="amount"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={update('amount')}
              />
              {errors.amount && <div className="field-error">{errors.amount}</div>}
            </div>

            <div className="field">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" value={form.date} onChange={update('date')} />
              {errors.date && <div className="field-error">{errors.date}</div>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={update('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <div className="field-error">{errors.category}</div>}
          </div>

          <div className="field">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              rows={3}
              maxLength={300}
              value={form.description}
              onChange={update('description')}
            />
            {errors.description && <div className="field-error">{errors.description}</div>}
          </div>

          {submitError && <div className="alert alert-error">{submitError}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : expense ? 'Save changes' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
