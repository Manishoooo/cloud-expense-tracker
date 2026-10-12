import SummaryCards from '../components/SummaryCards';
import CategoryChart from '../components/CategoryChart';
import ExpenseTable from '../components/ExpenseTable';

export default function DashboardPage({ expenses, onEdit, onDelete, onViewAll }) {
  return (
    <>
      <SummaryCards expenses={expenses} />
      <div className="dash-grid">
        <CategoryChart expenses={expenses} />
        <div className="card">
          <div className="card-title-row">
            <h2 className="card-title">Recent transactions</h2>
            <button className="btn btn-ghost btn-sm" onClick={onViewAll}>
              View all
            </button>
          </div>
          <ExpenseTable expenses={expenses.slice(0, 5)} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </>
  );
}
