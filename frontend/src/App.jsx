import { useEffect, useState } from 'react';
import api from './api/api.js';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

function App() {
  const { user, loading, logout } = useAuth();
  const [notices, setNotices] = useState([]);
  const [mode, setMode] = useState('login');

  useEffect(() => {
    if (!user) {
      setNotices([]);
      return;
    }

    api.get('/notices')
      .then((response) => setNotices(response.data))
      .catch(() => setNotices([]));
  }, [user]);

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

          <h2>Notices</h2>
          <ul>
            {notices.map((notice) => (
              <li key={notice.id}>{notice.title}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;
