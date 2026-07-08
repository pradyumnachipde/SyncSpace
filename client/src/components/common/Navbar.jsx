import { useState, useRef, useEffect } from 'react';
import { FiMenu, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const Navbar = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button
          type="button"
          className="btn btn-ghost btn-icon mobile-nav-toggle"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
        <span className="navbar__title">{title}</span>
      </div>

      <div className="navbar__user" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span className="avatar avatar-md">{initials}</span>
          <span className="navbar__user-info">
            <span className="navbar__user-name">{user?.name}</span>
            <span className="navbar__user-email">{user?.email}</span>
          </span>
          <FiChevronDown size={16} color="var(--color-muted)" />
        </button>

        {menuOpen && (
          <div className="navbar__menu">
            <button type="button" className="navbar__menu-item" disabled>
              <FiUser size={15} />
              My profile
            </button>
            <button type="button" className="navbar__menu-item" onClick={logout}>
              <FiLogOut size={15} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
