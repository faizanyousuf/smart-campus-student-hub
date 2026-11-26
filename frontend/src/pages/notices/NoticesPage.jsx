import { useEffect, useState } from 'react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../../components/Icon.jsx';
import {
  Badge,
  EmptyState,
  ErrorBox,
  PageHeader,
  apiError,
  categoryTone
} from '../../components/ui.jsx';

const emptyForm = { title: '', body: '', category: 'GENERAL', pinned: false };

export default function NoticesPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    api
      .get('/notices')
      .then((response) => setNotices(response.data))
      .catch((err) => setError(apiError(err)));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/notices', { ...form, postedById: user.id });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const togglePin = async (notice) => {
    try {
      await api.patch(`/notices/${notice.id}/${notice.pinned ? 'unpin' : 'pin'}`);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const remove = async (notice) => {
    try {
      await api.delete(`/notices/${notice.id}`);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const sorted = [...notices].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <>
      <PageHeader
        eyebrow="Communication"
        title="Notices"
        description="Campus-wide announcements, academic updates and upcoming events."
        actions={
          canManage && (
            <Badge tone="violet">
              <Icon name="shield" size={12} /> Manager access
            </Badge>
          )
        }
      />

      <ErrorBox message={error} />

      <div className="content-grid">
        {canManage && (
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Compose notice</h3>
                <p className="card-sub">Publish an update for the whole campus.</p>
              </div>
              <Icon name="plus" size={18} />
            </div>
            <form onSubmit={create}>
              <div className="form-grid">
                <div className="field field-full">
                  <label htmlFor="notice-title">Title</label>
                  <input
                    id="notice-title"
                    placeholder="e.g. Exam schedule released"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="field field-full">
                  <label htmlFor="notice-body">Message</label>
                  <textarea
                    id="notice-body"
                    placeholder="Write the notice..."
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                  />
                </div>
                <div className="field field-full">
                  <label htmlFor="notice-category">Category</label>
                  <select
                    id="notice-category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option>GENERAL</option>
                    <option>ACADEMIC</option>
                    <option>EVENT</option>
                    <option>URGENT</option>
                  </select>
                </div>
                <div className="field field-full">
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={form.pinned}
                      onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                    />
                    Pin this notice to the top
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                  <Icon name="plus" size={15} /> Publish notice
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Published notices</h3>
              <p className="card-sub">{sorted.length} notice{sorted.length === 1 ? '' : 's'} in the feed</p>
            </div>
            <Icon name="notice" size={18} />
          </div>

          {sorted.length === 0 ? (
            <EmptyState title="No notices yet" text="New campus announcements will appear here." />
          ) : (
            <div className="list">
              {sorted.map((notice) => (
                <article className="list-item" key={notice.id}>
                  <div className="item-top">
                    <h4 className="item-title">{notice.title}</h4>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {notice.pinned && (
                        <span className="pin-mark">
                          <Icon name="pin" size={12} /> Pinned
                        </span>
                      )}
                      <Badge tone={categoryTone(notice.category)}>{notice.category}</Badge>
                    </div>
                  </div>
                  <p className="item-body">{notice.body}</p>
                  <div className="item-meta">
                    <span>
                      <Icon name="users" size={13} /> {notice.postedByName}
                    </span>
                    <span className="mono">#{notice.id}</span>
                  </div>
                  {canManage && (
                    <div className="item-actions">
                      <button className="btn btn-sm" onClick={() => togglePin(notice)}>
                        <Icon name="pin" size={13} />
                        {notice.pinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(notice)}>
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
