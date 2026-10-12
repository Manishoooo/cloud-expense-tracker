import { currentMonthKey, formatINR } from '../utils/helpers';

export default function SummaryCards({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const monthKey = currentMonthKey();
  const monthTotal = expenses
    .filter((e) => e.date.startsWith(monthKey))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="summary-grid">
      <div className="card stat-card primary">
        <div className="stat-label">Total expenses</div>
        <div className="stat-value">{formatINR(total)}</div>
      </div>
      <div className="card stat-card">
        <div className="stat-label">Transactions</div>
        <div className="stat-value">{expenses.length}</div>
      </div>
      <div className="card stat-card">
        <div className="stat-label">This month</div>
        <div className="stat-value">{formatINR(monthTotal)}</div>
      </div>
    </div>
  );
}
