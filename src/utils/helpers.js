export const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Education', 'Bills', 'Healthcare', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#2563eb',
  Transport: '#0ea5e9',
  Shopping: '#6366f1',
  Education: '#14b8a6',
  Bills: '#f59e0b',
  Healthcare: '#ef4444',
  Other: '#64748b',
};

// Format a number as Indian Rupees, e.g. ₹1,250.00
export function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

// Today's date (or N days ago) as YYYY-MM-DD in the user's local time zone.
export function todayISO(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "2026-10" for the current month
export function currentMonthKey() {
  return todayISO().slice(0, 7);
}

// "2026-10-12" -> "12 Oct 2026"
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Returns an object of error messages. Empty object means the form is valid.
export function validateExpense(form) {
  const errors = {};
  const title = form.title.trim();
  const amount = Number(form.amount);

  if (!title) errors.title = 'Enter a title.';
  else if (title.length > 100) errors.title = 'Keep the title under 100 characters.';

  if (form.amount === '' || Number.isNaN(amount)) errors.amount = 'Enter a valid amount.';
  else if (amount <= 0) errors.amount = 'Amount must be greater than 0.';
  else if (amount > 10000000) errors.amount = 'Amount is too large.';

  if (!CATEGORIES.includes(form.category)) errors.category = 'Choose a category.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) errors.date = 'Choose a date.';
  if (form.description.length > 300) errors.description = 'Keep the description under 300 characters.';

  return errors;
}

// Turns Firebase error codes into messages a normal person can understand.
export function friendlyError(err) {
  const code = err?.code || '';
  const messages = {
    'auth/invalid-email': 'That email address is not valid.',
    'auth/missing-password': 'Enter your password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with this email already exists. Log in instead.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled in the Firebase console.',
    'permission-denied':
      'Permission denied. Make sure you are logged in and the Firestore security rules are deployed.',
    unavailable: 'The database could not be reached. Check your internet connection and try again.',
    'failed-precondition': 'The database is not ready. Make sure Firestore is created in the Firebase console.',
  };
  return messages[code] || err?.message || 'Something went wrong. Please try again.';
}
