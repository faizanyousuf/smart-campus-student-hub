import { useEffect, useState } from 'react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function NoticesPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    body: '',
    category: 'GENERAL',
    pinned: false
  });

  const load = () => {
    api.get('/notices')
      .then((response) => setNotices(response.data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/notices', { ...form, postedById: user.id });
      setForm({ title: '', body: '', category: 'GENERAL', pinned: false });
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const pin = async (notice) => {
    await api.patch(`/notices/${notice.id}/pin`);
    load();
  };

  const unpin = async (notice) => {
    await api.patch(`/notices/${notice.id}/unpin`);
    load();
  };

  const remove = async (notice) => {
    await api.delete(`/notices/${notice.id}`);
    load();
  };

  return (
    <section>
      <h2>Notices</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {canManage && (
        <form onSubmit={create} style={{ maxWidth: 480, marginBottom: 16 }}>
          <h3>Post a notice</h3>

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ display: 'block', width: '100%', margin: '6px 0' }}
          />

          <textarea
            placeholder="Body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            style={{ display: 'block', width: '100%', margin: '6px 0' }}
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ display: 'block', width: '100%', margin: '6px 0' }}
          >
            <option>GENERAL</option>
            <option>ACADEMIC</option>
            <option>EVENT</option>
            <option>URGENT</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
            />
            Pin this notice
          </label>

          <button type="submit" style={{ marginTop: 8 }}>Post notice</button>
        </form>
      )}

      <ul>
        {notices.map((notice) => (
          <li key={notice.id} style={{ marginBottom: 12 }}>
            <strong>{notice.title}</strong>
            {notice.pinned && <em> (pinned)</em>}
            <div>{notice.body}</div>
            <small>
              {notice.category} - {notice.postedByName}
            </small>

            {canManage && (
              <div style={{ marginTop: 6 }}>
                {notice.pinned ? (
                  <button onClick={() => unpin(notice)}>Unpin</button>
                ) : (
                  <button onClick={() => pin(notice)}>Pin</button>
                )}
                <button onClick={() => remove(notice)} style={{ marginLeft: 6 }}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
