import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthShell from '../../components/AuthShell.jsx';
import Icon from '../../components/Icon.jsx';
import { ErrorBox } from '../../components/ui.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (event) => {
    setForm({ ...form, [key]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-card">
        <p className="eyebrow">Get started</p>
        <h2>Create your account</h2>
        <p>Join the hub to access notices, complaints and lost &amp; found.</p>

        <ErrorBox message={error} />

        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field field-full">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                placeholder="Your full name"
                value={form.fullName}
                onChange={update('fullName')}
              />
            </div>
            <div className="field field-full">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@smartcampus.edu"
                value={form.email}
                onChange={update('email')}
              />
            </div>
            <div className="field field-full">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={update('password')}
              />
            </div>
            <div className="field">
              <label htmlFor="register-student-id">Student ID</label>
              <input
                id="register-student-id"
                placeholder="Optional"
                value={form.studentId}
                onChange={update('studentId')}
              />
            </div>
            <div className="field">
              <label htmlFor="register-department">Department</label>
              <input
                id="register-department"
                placeholder="Optional"
                value={form.department}
                onChange={update('department')}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? <span className="spinner" /> : <Icon name="plus" size={15} />}
              {busy ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="auth-switch">
          Already registered? <Link to="/login">Sign in instead</Link>
        </div>
      </div>
    </AuthShell>
  );
}
