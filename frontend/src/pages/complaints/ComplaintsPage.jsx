import { useEffect, useState } from 'react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../../components/Icon.jsx';
import {
  Badge,
  EmptyState,
  ErrorBox,
  PageHeader,
  statusTone
} from '../../components/ui.jsx';

const emptyForm = { title: '', description: '', category: 'FACILITY' };

export default function ComplaintsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    api
      .get('/complaints')
      .then((response) => setComplaints(response.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/complaints', form);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const assignToMe = async (complaint) => {
    try {
      await api.patch(`/complaints/${complaint.id}/assign`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const changeStatus = async (complaint, status) => {
    try {
      await api.patch(`/complaints/${complaint.id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const openCount = complaints.filter((c) => c.status === 'OPEN').length;

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Complaints"
        description="Submit an issue and follow its progress from open to resolved."
        actions={
          <>
            <Badge tone="amber">{openCount} open</Badge>
            {canManage && (
              <Badge tone="violet">
                <Icon name="shield" size={12} /> Staff view
              </Badge>
            )}
          </>
        }
      />

      <ErrorBox message={error} />

      <div className="content-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">New complaint</h3>
              <p className="card-sub">Tell us what needs attention.</p>
            </div>
            <Icon name="plus" size={18} />
          </div>
          <form onSubmit={create}>
            <div className="form-grid">
              <div className="field field-full">
                <label htmlFor="complaint-title">Title</label>
                <input
                  id="complaint-title"
                  placeholder="Short summary of the issue"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="field field-full">
                <label htmlFor="complaint-description">Description</label>
                <textarea
                  id="complaint-description"
                  placeholder="Add details that will help us resolve it..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="field field-full">
                <label htmlFor="complaint-category">Category</label>
                <select
                  id="complaint-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>FACILITY</option>
                  <option>ACADEMIC</option>
                  <option>HOSTEL</option>
                  <option>TRANSPORT</option>
                  <option>OTHER</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                <Icon name="plus" size={15} /> Submit complaint
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Complaint queue</h3>
              <p className="card-sub">{complaints.length} total record{complaints.length === 1 ? '' : 's'}</p>
            </div>
            <Icon name="complaint" size={18} />
          </div>

          {complaints.length === 0 ? (
            <EmptyState title="No complaints yet" text="Submitted issues will appear here." />
          ) : (
            <div className="list">
              {complaints.map((complaint) => (
                <article className="list-item" key={complaint.id}>
                  <div className="item-top">
                    <h4 className="item-title">
                      <span className="mono">{complaint.referenceCode}</span> — {complaint.title}
                    </h4>
                    <Badge tone={statusTone(complaint.status)}>{complaint.status}</Badge>
                  </div>
                  <p className="item-body">{complaint.description}</p>
                  <div className="item-meta">
                    <span>{complaint.category}</span>
                    <span>
                      <Icon name="users" size={13} /> {complaint.createdByName}
                    </span>
                    {complaint.assignedToName && (
                      <span>Assigned to {complaint.assignedToName}</span>
                    )}
                  </div>
                  {canManage && (
                    <div className="item-actions">
                      {!complaint.assignedToId && (
                        <button className="btn btn-sm" onClick={() => assignToMe(complaint)}>
                          <Icon name="check" size={13} /> Assign to me
                        </button>
                      )}
                      <select
                        aria-label={`Status for ${complaint.referenceCode}`}
                        value={complaint.status}
                        onChange={(e) => changeStatus(complaint, e.target.value)}
                      >
                        <option>OPEN</option>
                        <option>IN_PROGRESS</option>
                        <option>RESOLVED</option>
                        <option>REJECTED</option>
                      </select>
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
