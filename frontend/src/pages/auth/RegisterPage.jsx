import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

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
    <form onSubmit={submit} style={{ maxWidth: 360 }}>
      <h2>Register</h2>

      <label>
        Full name
        <input value={form.fullName} onChange={update('fullName')}
          style={{ display: 'block', width: '100%', margin: '6px 0' }} />
      </label>

      <label>
        Email
        <input type="email" value={form.email} onChange={update('email')}
          style={{ display: 'block', width: '100%', margin: '6px 0' }} />
      </label>

      <label>
        Password
        <input type="password" value={form.password} onChange={update('password')}
          style={{ display: 'block', width: '100%', margin: '6px 0' }} />
      </label>

      <label>
        Student ID
        <input value={form.studentId} onChange={update('studentId')}
          style={{ display: 'block', width: '100%', margin: '6px 0' }} />
      </label>

      <label>
        Department
        <input value={form.department} onChange={update('department')}
          style={{ display: 'block', width: '100%', margin: '6px 0' }} />
      </label>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={busy}>
        {busy ? 'Creating...' : 'Create account'}
      </button>
    </form>
  );
}
