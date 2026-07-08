import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiFolder, FiX, FiZap } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/teams', label: 'Teams', icon: <FiUsers /> },
  { to: '/projects', label: 'Projects', icon: <FiFolder /> },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark" />
        <span className="sidebar__brand-name">SyncSpace</span>
        <button
          type="button"
          className="btn btn-ghost btn-icon mobile-nav-toggle"
          style={{ marginLeft: 'auto' }}
          onClick={onClose}
          aria-label="Close menu"
        >
          <FiX />
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__link" style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>
          <FiZap />
          Built for focused teams
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
