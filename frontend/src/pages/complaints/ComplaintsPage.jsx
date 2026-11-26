import { useEffect, useState } from 'react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ComplaintsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'FACILITY'
  });

  const load = () => {
    api.get('/complaints')
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
      setForm({ title: '', description: '', category: 'FACILITY' });
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

  return (
    <section>
      <h2>Complaints</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={create} style={{ maxWidth: 480, marginBottom: 16 }}>
        <h3>Submit a complaint</h3>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        >
          <option>FACILITY</option>
          <option>ACADEMIC</option>
          <option>HOSTEL</option>
          <option>TRANSPORT</option>
          <option>OTHER</option>
        </select>

        <button type="submit" style={{ marginTop: 8 }}>Submit complaint</button>
      </form>

      {complaints.length === 0 && <p>No complaints yet.</p>}

      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id} style={{ marginBottom: 16 }}>
            <strong>
              {complaint.referenceCode} — {complaint.title}
            </strong>
            <div>{complaint.description}</div>
            <small>
              {complaint.category} · {complaint.status} · by {complaint.createdByName}
              {complaint.assignedToName && ` · assigned to ${complaint.assignedToName}`}
            </small>

            {canManage && (
              <div style={{ marginTop: 8 }}>
                {!complaint.assignedToId && (
                  <button onClick={() => assignToMe(complaint)}>Assign to me</button>
                )}

                <select
                  value={complaint.status}
                  onChange={(e) => changeStatus(complaint, e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  <option>OPEN</option>
                  <option>IN_PROGRESS</option>
                  <option>RESOLVED</option>
                  <option>REJECTED</option>
                </select>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
