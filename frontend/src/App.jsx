import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import NoticesPage from './pages/notices/NoticesPage.jsx';
import { useState } from 'react';

function App() {
  const { user, loading, logout } = useAuth();
  const [mode, setMode] = useState('login');

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

          <NoticesPage />
        </>
      )}
    </main>
  );
}

export default App;
