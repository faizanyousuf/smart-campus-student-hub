import { useEffect, useState } from 'react';
import api from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LostFoundPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [filter, setFilter] = useState('ALL');
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    itemName: '',
    description: '',
    category: '',
    location: '',
    lostOrFound: 'LOST',
    imageUrl: ''
  });

  const loadItems = () => {
    const url = filter === 'ALL'
      ? '/lost-items'
      : `/lost-items/type/${filter}`;

    api.get(url)
      .then((response) => setItems(response.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  const loadClaims = () => {
    api.get('/claims')
      .then((response) => setClaims(response.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  };

  useEffect(() => {
    loadItems();
    loadClaims();
  }, [filter]);

  const report = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/lost-items', form);
      setForm({
        itemName: '',
        description: '',
        category: '',
        location: '',
        lostOrFound: 'LOST',
        imageUrl: ''
      });
      loadItems();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const claimItem = async (item) => {
    const message = window.prompt('Why do you believe this item is yours?');
    if (message === null) return;

    try {
      await api.post(`/lost-items/${item.id}/claims`, { message });
      loadClaims();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const changeItemStatus = async (item, status) => {
    try {
      await api.patch(`/lost-items/${item.id}/status`, { status });
      loadItems();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const decide = async (claim, status) => {
    try {
      await api.patch(`/claims/${claim.id}/decision`, { status });
      loadClaims();
      loadItems();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <section>
      <h2>Lost &amp; Found</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: 12 }}>
        {['ALL', 'LOST', 'FOUND'].map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            disabled={filter === value}
            style={{ marginRight: 6 }}
          >
            {value}
          </button>
        ))}
      </div>

      <form onSubmit={report} style={{ maxWidth: 480, marginBottom: 16 }}>
        <h3>Report an item</h3>

        <input
          placeholder="Item name"
          value={form.itemName}
          onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        />

        <input
          placeholder="Category (e.g. Electronics)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        />

        <select
          value={form.lostOrFound}
          onChange={(e) => setForm({ ...form, lostOrFound: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        >
          <option>LOST</option>
          <option>FOUND</option>
        </select>

        <input
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          style={{ display: 'block', width: '100%', margin: '6px 0' }}
        />

        <button type="submit" style={{ marginTop: 8 }}>Report item</button>
      </form>

      <h3>Items</h3>
      {items.length === 0 && <p>No items found.</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 16 }}>
            <strong>
              {item.referenceCode} — {item.itemName}
            </strong>{' '}
            <em>({item.lostOrFound})</em>
            <div>{item.description}</div>
            <small>
              {item.category} · {item.location} · {item.status} · reported by{' '}
              {item.createdByName}
            </small>

            <div style={{ marginTop: 8 }}>
              <button onClick={() => claimItem(item)}>Claim</button>

              {canManage && (
                <select
                  value={item.status}
                  onChange={(e) => changeItemStatus(item, e.target.value)}
                  style={{ marginLeft: 8 }}
                >
                  <option>OPEN</option>
                  <option>MATCHED</option>
                  <option>CLAIMED</option>
                  <option>RETURNED</option>
                </select>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h3>Claims</h3>
      {claims.length === 0 && <p>No claims yet.</p>}

      <ul>
        {claims.map((claim) => (
          <li key={claim.id} style={{ marginBottom: 12 }}>
            <strong>
              {claim.itemReferenceCode} — {claim.itemName}
            </strong>
            <div>{claim.message}</div>
            <small>
              claimed by {claim.claimedByName} · {claim.status}
              {claim.handledByName && ` · handled by ${claim.handledByName}`}
            </small>

            {canManage && claim.status === 'PENDING' && (
              <div style={{ marginTop: 6 }}>
                <button onClick={() => decide(claim, 'APPROVED')}>Approve</button>
                <button
                  onClick={() => decide(claim, 'REJECTED')}
                  style={{ marginLeft: 6 }}
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
