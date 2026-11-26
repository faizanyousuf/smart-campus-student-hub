import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from './Icon.jsx';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/notices', label: 'Notices', icon: 'notice' },
  { to: '/complaints', label: 'Complaints', icon: 'complaint' },
  { to: '/lost-found', label: 'Lost & Found', icon: 'lostfound' }
];

const linkClass = ({ isActive }) => (isActive ? 'nav-item active' : 'nav-item');

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const current = navigation.find((item) => location.pathname.startsWith(item.to));
  const pageName = current?.label || 'Workspace';

  const doLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Icon name="spark" size={21} />
          </div>
          <div>
            <div className="brand-name">Smart Campus</div>
            <div className="brand-sub">Student Hub</div>
          </div>
        </div>

        <div className="sidebar-label">Workspace</div>
        <nav className="nav-list">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-note">
          <div className="sidebar-note-title">
            <Icon name="shield" size={15} />
            Secure session
          </div>
          <p>Your activity is protected with a signed JWT access token.</p>
        </div>

        <div className="user-card">
          <div className="avatar">{initials(user.fullName)}</div>
          <div className="user-info" style={{ minWidth: 0 }}>
            <div className="user-name">{user.fullName}</div>
            <div className="user-role">{user.role}</div>
          </div>
          <button className="signout" onClick={doLogout} title="Sign out">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{pageName}</strong>
          </div>
          <div className="topbar-right">
            <span className="chip">
              <span className="dot" />
              System online
            </span>
            <button className="icon-button" title={user.fullName}>
              <Icon name="users" size={17} />
            </button>
          </div>
        </header>

        <div className="page-wrap">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
