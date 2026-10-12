import { useCallback, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ExpenseForm from './components/ExpenseForm';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import { watchAuth, logout } from './services/authService';
import {
  subscribeExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  addSampleExpenses,
} from './services/expenseService';
import { friendlyError } from './utils/helpers';

const PAGE_TEXT = {
  dashboard: ['Dashboard', 'Your spending at a glance'],
  expenses: ['Expenses', 'Search, filter and manage your transactions'],
};

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = logged out
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [view, setView] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const uid = user?.uid;

  const showToast = (type, message) => setToast({ type, message });
  const closeToast = useCallback(() => setToast(null), []);

  // 1. Watch the login state
  useEffect(() => watchAuth(setUser), []);

  // 2. Once logged in, listen to this user's expenses
  useEffect(() => {
    if (!uid) {
      setExpenses([]);
      setLoadError('');
      setLoading(true);
      return undefined;
    }
    setLoading(true);
    setLoadError('');
    return subscribeExpenses(
      uid,
      (items) => {
        setExpenses(items);
        setLoading(false);
      },
      (err) => {
        setLoadError(friendlyError(err));
        setLoading(false);
      }
    );
  }, [uid]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(expense) {
    setEditing(expense);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  // Errors are thrown on purpose so the form can show them.
  async function handleSave(data) {
    if (editing) {
      await updateExpense(uid, editing.id, data);
      showToast('success', 'Expense updated.');
    } else {
      await addExpense(uid, data);
      showToast('success', 'Expense added.');
    }
    closeForm();
  }

  async function confirmDelete() {
    setDeleteBusy(true);
    try {
      await deleteExpense(uid, deleting.id);
      showToast('success', 'Expense deleted.');
    } catch (err) {
      showToast('error', friendlyError(err));
    } finally {
      setDeleteBusy(false);
      setDeleting(null);
    }
  }

  function handleSampleData() {
    try {
      addSampleExpenses();
      showToast('success', 'Sample expenses added.');
    } catch {
      showToast('error', 'Could not save to this browser. Check that storage is not blocked.');
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setView('dashboard');
    } catch (err) {
      showToast('error', friendlyError(err));
    }
  }

  if (user === undefined) {
    return (
      <div className="fullscreen-center">
        <div className="spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (user === null) return <LoginPage />;

  let content;
  if (loading) {
    content = (
      <div className="center-pad">
        <div className="spinner" role="status" aria-label="Loading" />
        <p className="muted">Loading your expenses…</p>
      </div>
    );
  } else if (loadError) {
    content = null; // The error banner above explains what happened.
  } else if (expenses.length === 0) {
    content = <EmptyState isDemo={user.isDemo} onAdd={openAdd} onLoadSample={handleSampleData} />;
  } else if (view === 'dashboard') {
    content = (
      <DashboardPage
        expenses={expenses}
        onEdit={openEdit}
        onDelete={setDeleting}
        onViewAll={() => setView('expenses')}
      />
    );
  } else {
    content = <ExpensesPage expenses={expenses} onEdit={openEdit} onDelete={setDeleting} />;
  }

  const [title, subtitle] = PAGE_TEXT[view];

  return (
    <div className="app">
      <Sidebar view={view} onNavigate={setView} user={user} onLogout={handleLogout} />

      <main className="main">
        <div className="container">
          <header className="page-header">
            <div>
              <h1>{title}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
            <button className="btn btn-primary" onClick={openAdd} disabled={Boolean(loadError)}>
              + Add expense
            </button>
          </header>

          {user.isDemo && (
            <div className="alert alert-warn">
              <strong>Demo mode.</strong> Firebase is not configured, so your expenses are stored only in this
              browser (localStorage). They are not saved to the cloud and disappear if you clear browser data.
            </div>
          )}

          {loadError && (
            <div className="alert alert-error">
              <strong>Could not load your expenses.</strong> {loadError} Your changes are not being saved
              until this is fixed.
            </div>
          )}

          {content}
        </div>
      </main>

      {formOpen && <ExpenseForm expense={editing} onSubmit={handleSave} onClose={closeForm} />}
      {deleting && (
        <ConfirmDialog
          expense={deleting}
          busy={deleteBusy}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
