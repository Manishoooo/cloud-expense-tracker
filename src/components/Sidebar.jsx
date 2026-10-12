const icons = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  expenses: (
    <>
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <circle cx="4.5" cy="6" r="1" />
      <circle cx="4.5" cy="12" r="1" />
      <circle cx="4.5" cy="18" r="1" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

// Left sidebar on desktop, bottom bar on mobile (handled in CSS).
export default function Sidebar({ view, onNavigate, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-logo">₹</span>
        <span>Expense Tracker</span>
      </div>

      <nav className="nav" aria-label="Main navigation">
        <button
          className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <Icon name="dashboard" />
          Dashboard
        </button>
        <button
          className={`nav-btn ${view === 'expenses' ? 'active' : ''}`}
          onClick={() => onNavigate('expenses')}
        >
          <Icon name="expenses" />
          Expenses
        </button>
        {!user.isDemo && (
          <button className="nav-btn nav-logout" onClick={onLogout}>
            <Icon name="logout" />
            Log out
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        {user.isDemo ? (
          <>
            <strong>Demo mode</strong>
            <div>Saved in this browser only</div>
          </>
        ) : (
          <>
            <strong>Cloud sync on</strong>
            <div>{user.email}</div>
          </>
        )}
      </div>
    </aside>
  );
}
