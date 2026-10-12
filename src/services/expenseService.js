import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { todayISO } from '../utils/helpers';

/*
  One set of functions, two storage backends:
  - Firebase configured  -> Cloud Firestore at users/{uid}/expenses (errors are thrown, never hidden)
  - Not configured       -> localStorage (demo mode only)
*/

const STORAGE_KEY = 'cloud-expense-tracker-demo-expenses';
const demoListeners = new Set();

// ---------- Demo mode helpers (localStorage) ----------
function readLocal() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  demoListeners.forEach((notify) => notify());
}

function sortNewestFirst(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// ---------- Firestore helpers ----------
const expensesRef = (uid) => collection(db, 'users', uid, 'expenses');
const expenseRef = (uid, id) => doc(db, 'users', uid, 'expenses', id);

// If the network is down, Firestore waits forever. Fail after 15 seconds instead.
function withTimeout(promise, ms = 15000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject({ code: 'unavailable' }), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// ---------- Public API ----------

// Listens for changes. onData(expenses) is called with the newest-first list.
// Returns a function that stops listening.
export function subscribeExpenses(uid, onData, onError) {
  if (!isFirebaseConfigured) {
    const emit = () => onData(sortNewestFirst(readLocal()));
    demoListeners.add(emit);
    emit();
    return () => demoListeners.delete(emit);
  }

  const q = query(expensesRef(uid), orderBy('date', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

// data = { title, amount, category, date, description }
export async function addExpense(uid, data) {
  if (!isFirebaseConfigured) {
    writeLocal([...readLocal(), { ...data, id: newId(), createdAt: Date.now() }]);
    return;
  }
  await withTimeout(addDoc(expensesRef(uid), { ...data, createdAt: serverTimestamp() }));
}

export async function updateExpense(uid, id, data) {
  if (!isFirebaseConfigured) {
    writeLocal(readLocal().map((e) => (e.id === id ? { ...e, ...data } : e)));
    return;
  }
  await withTimeout(updateDoc(expenseRef(uid, id), { ...data, updatedAt: serverTimestamp() }));
}

export async function deleteExpense(uid, id) {
  if (!isFirebaseConfigured) {
    writeLocal(readLocal().filter((e) => e.id !== id));
    return;
  }
  await withTimeout(deleteDoc(expenseRef(uid, id)));
}

// Demo mode only: adds a few example expenses.
export function addSampleExpenses() {
  const samples = [
    ['Canteen lunch', 180, 'Food', 0],
    ['Metro card recharge', 500, 'Transport', 1],
    ['Data structures textbook', 650, 'Education', 3],
    ['Electricity bill', 1450, 'Bills', 5],
    ['T-shirt', 799, 'Shopping', 7],
    ['Pharmacy', 320, 'Healthcare', 9],
    ['Movie night', 400, 'Other', 11],
    ['Weekly groceries', 920, 'Food', 13],
  ].map(([title, amount, category, daysAgo], i) => ({
    id: newId() + i,
    title,
    amount,
    category,
    date: todayISO(daysAgo),
    description: '',
    createdAt: Date.now() + i,
  }));
  writeLocal([...readLocal(), ...samples]);
}
