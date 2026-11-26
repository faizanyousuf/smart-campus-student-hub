import { useAuth } from './context/AuthContext.jsx';
import { useState } from 'react';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import NoticesPage from './pages/notices/NoticesPage.jsx';
import ComplaintsPage from './pages/complaints/ComplaintsPage.jsx';
import LostFoundPage from './pages/lostfound/LostFoundPage.jsx';

function App() {
  const { user, loading, logout } = useAuth();
  const [mode, setMode] = useState('login');
  const [tab, setTab] = useState('notices');

  if (loading) {
    return <p style={{ fontFamily: 'sans-serif', padding: 24 }}>Loading...</p>;
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Smart Campus Student Hub</h1>

      {!user ? (
        <>
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            Switch to {mode === 'login' ? 'register' : 'login'}
          </button>

          {mode === 'login' ? <LoginPage /> : <RegisterPage />}
        </>
      ) : (
        <>
          <p>
            Signed in as <strong>{user.fullName}</strong> ({user.role})
          </p>
          <button onClick={logout}>Logout</button>

          <div style={{ margin: '16px 0' }}>
            <button onClick={() => setTab('notices')} disabled={tab === 'notices'}>
              Notices
            </button>
            <button
              onClick={() => setTab('complaints')}
              disabled={tab === 'complaints'}
              style={{ marginLeft: 8 }}
            >
              Complaints
            </button>
            <button
              onClick={() => setTab('lostfound')}
              disabled={tab === 'lostfound'}
              style={{ marginLeft: 8 }}
            >
              Lost &amp; Found
            </button>
          </div>

          {tab === 'notices' && <NoticesPage />}
          {tab === 'complaints' && <ComplaintsPage />}
          {tab === 'lostfound' && <LostFoundPage />}
        </>
      )}
    </main>
  );
}

export default App;
