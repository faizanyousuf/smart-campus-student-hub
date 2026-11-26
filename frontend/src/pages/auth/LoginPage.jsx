import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthShell from '../../components/AuthShell.jsx';
import Icon from '../../components/Icon.jsx';
import { ErrorBox } from '../../components/ui.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('student@smartcampus.edu');
  const [password, setPassword] = useState('Demo@12345');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to your hub</h2>
        <p>Use your campus account to continue to the workspace.</p>

        <ErrorBox message={error} />

        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field field-full">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@smartcampus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field field-full">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? <span className="spinner" /> : <Icon name="arrow" size={15} />}
              {busy ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="auth-demo">
          Demo student: <code>student@smartcampus.edu</code> / <code>Demo@12345</code>
          <br />
          Staff and admin accounts use the same demo password.
        </div>

        <div className="auth-switch">
          New to campus? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </AuthShell>
  );
}
