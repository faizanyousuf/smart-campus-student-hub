import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const linkStyle = ({ isActive }) => ({
    marginRight: 12,
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none'
  });

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Smart Campus Student Hub</h1>
      <p>
        Signed in as <strong>{user.fullName}</strong> ({user.role})
      </p>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: '16px 0',
          paddingBottom: 12,
          borderBottom: '1px solid #ddd'
        }}
      >
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/notices" style={linkStyle}>Notices</NavLink>
        <NavLink to="/complaints" style={linkStyle}>Complaints</NavLink>
        <NavLink to="/lost-found" style={linkStyle}>Lost &amp; Found</NavLink>
        <button onClick={doLogout} style={{ marginLeft: 'auto' }}>Logout</button>
      </nav>

      <Outlet />
    </main>
  );
}
