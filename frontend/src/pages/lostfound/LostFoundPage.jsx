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
  statusTone
} from '../../components/ui.jsx';

const emptyForm = {
  itemName: '',
  description: '',
  category: '',
  location: '',
  lostOrFound: 'LOST',
  imageUrl: ''
};

export default function LostFoundPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const [filter, setFilter] = useState('ALL');
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const loadItems = () => {
    const url = filter === 'ALL' ? '/lost-items' : `/lost-items/type/${filter}`;

    api
      .get(url)
      .then((response) => setItems(response.data))
      .catch((err) => setError(apiError(err)));
  };

  const loadClaims = () => {
    api
      .get('/claims')
      .then((response) => setClaims(response.data))
      .catch((err) => setError(apiError(err)));
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
      setForm(emptyForm);
      loadItems();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const claimItem = async (item) => {
    const message = window.prompt('Why do you believe this item is yours?');
    if (message === null) return;

    try {
      await api.post(`/lost-items/${item.id}/claims`, { message });
      loadClaims();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const changeItemStatus = async (item, status) => {
    try {
      await api.patch(`/lost-items/${item.id}/status`, { status });
      loadItems();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const decide = async (claim, status) => {
    try {
      await api.patch(`/claims/${claim.id}/decision`, { status });
      loadClaims();
      loadItems();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const pendingClaims = claims.filter((claim) => claim.status === 'PENDING').length;

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Lost & Found"
        description="Report a belonging, browse items around campus and manage claims."
        actions={
          <>
            <Badge tone="amber">{pendingClaims} pending claims</Badge>
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
              <h3 className="card-title">Report an item</h3>
              <p className="card-sub">Help reunite belongings with their owners.</p>
            </div>
            <Icon name="plus" size={18} />
          </div>
          <form onSubmit={report}>
            <div className="form-grid">
              <div className="field field-full">
                <label htmlFor="item-name">Item name</label>
                <input
                  id="item-name"
                  placeholder="e.g. Blue backpack"
                  value={form.itemName}
                  onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                />
              </div>
              <div className="field field-full">
                <label htmlFor="item-description">Description</label>
                <textarea
                  id="item-description"
                  placeholder="Distinguishing details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="item-category">Category</label>
                <input
                  id="item-category"
                  placeholder="Electronics"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="item-location">Location</label>
                <input
                  id="item-location"
                  placeholder="Library, floor 2"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="item-type">Type</label>
                <select
                  id="item-type"
                  value={form.lostOrFound}
                  onChange={(e) => setForm({ ...form, lostOrFound: e.target.value })}
                >
                  <option>LOST</option>
                  <option>FOUND</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="item-image">Image URL</label>
                <input
                  id="item-image"
                  placeholder="Optional"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                <Icon name="plus" size={15} /> Report item
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Item directory</h3>
              <p className="card-sub">{items.length} item{items.length === 1 ? '' : 's'} in view</p>
            </div>
            <div className="segmented">
              {['ALL', 'LOST', 'FOUND'].map((value) => (
                <button
                  key={value}
                  className={filter === value ? 'active' : ''}
                  onClick={() => setFilter(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyState title="No items found" text="Try another filter or report an item." />
          ) : (
            <div className="item-grid">
              {items.map((item) => (
                <article className="item-card" key={item.id}>
                  <div className="item-top">
                    <h4 className="item-title">{item.itemName}</h4>
                    <Badge tone={item.lostOrFound === 'LOST' ? 'rose' : 'blue'}>
                      {item.lostOrFound}
                    </Badge>
                  </div>
                  <p className="item-body">{item.description}</p>
                  <div className="item-meta">
                    <span>{item.category}</span>
                    <span>{item.location}</span>
                    <span className="mono">{item.referenceCode}</span>
                  </div>
                  <div className="item-meta">
                    <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                    <span>by {item.createdByName}</span>
                  </div>
                  <div className="item-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => claimItem(item)}>
                      <Icon name="check" size={13} /> Claim
                    </button>
                    {canManage && (
                      <select
                        aria-label={`Status for ${item.referenceCode}`}
                        value={item.status}
                        onChange={(e) => changeItemStatus(item, e.target.value)}
                      >
                        <option>OPEN</option>
                        <option>MATCHED</option>
                        <option>CLAIMED</option>
                        <option>RETURNED</option>
                      </select>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">Claim requests</h3>
            <p className="card-sub">Review ownership requests submitted by students.</p>
          </div>
          <Icon name="clock" size={18} />
        </div>

        {claims.length === 0 ? (
          <EmptyState title="No claims yet" text="New ownership requests will show up here." />
        ) : (
          <div className="list">
            {claims.map((claim) => (
              <article className="list-item" key={claim.id}>
                <div className="item-top">
                  <h4 className="item-title">
                    <span className="mono">{claim.itemReferenceCode}</span> — {claim.itemName}
                  </h4>
                  <Badge tone={statusTone(claim.status)}>{claim.status}</Badge>
                </div>
                <p className="item-body">{claim.message}</p>
                <div className="item-meta">
                  <span>
                    <Icon name="users" size={13} /> {claim.claimedByName}
                  </span>
                  {claim.handledByName && <span>Handled by {claim.handledByName}</span>}
                </div>
                {canManage && claim.status === 'PENDING' && (
                  <div className="item-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => decide(claim, 'APPROVED')}>
                      <Icon name="check" size={13} /> Approve
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => decide(claim, 'REJECTED')}>
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
