import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api.js';
import Icon from '../../components/Icon.jsx';
import { Badge, EmptyState, apiError } from '../../components/ui.jsx';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then((response) => setData(response.data))
      .catch((err) => setError(apiError(err)));
  }, []);

  if (error) {
    return <EmptyState title="Could not load dashboard" text={error} />;
  }

  if (!data) {
    return (
      <div className="card">
        <div className="spinner" />
        <p className="muted">Loading workspace overview...</p>
      </div>
    );
  }

  const percentage = (part, total) =>
    total > 0 ? Math.round((part / total) * 100) : 0;

  const stats = [
    {
      label: 'Total notices',
      value: data.totalNotices,
      icon: 'notice',
      foot: 'Published across campus'
    },
    {
      label: 'Total complaints',
      value: data.totalComplaints,
      icon: 'complaint',
      foot: `${data.openComplaints} still open`
    },
    {
      label: 'Lost & found items',
      value: data.totalLostItems,
      icon: 'box',
      foot: `${data.openLostItems} still unmatched`
    },
    {
      label: 'Pending claims',
      value: data.pendingClaims,
      icon: 'clock',
      foot: 'Awaiting staff review'
    }
  ];

  const personal = [
    { label: 'My complaints', value: data.myComplaints, icon: 'complaint' },
    { label: 'My claims', value: data.myClaims, icon: 'check' },
    { label: 'My reported items', value: data.myLostItems, icon: 'box' }
  ];

  const progress = [
    {
      label: 'Complaints resolved',
      value: percentage(data.totalComplaints - data.openComplaints, data.totalComplaints),
      detail: `${data.totalComplaints - data.openComplaints} of ${data.totalComplaints}`
    },
    {
      label: 'Items no longer open',
      value: percentage(data.totalLostItems - data.openLostItems, data.totalLostItems),
      detail: `${data.totalLostItems - data.openLostItems} of ${data.totalLostItems}`
    },
    {
      label: 'Item claim coverage',
      value: percentage(data.myClaims, data.totalLostItems),
      detail: `${data.myClaims} claims against ${data.totalLostItems} items`
    }
  ];

  const shortcuts = [
    { to: '/notices', label: 'Browse campus notices', icon: 'notice' },
    { to: '/complaints', label: 'Track your complaints', icon: 'complaint' },
    { to: '/lost-found', label: 'Explore lost & found', icon: 'lostfound' }
  ];

  return (
    <>
      <div className="hero">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Welcome back, {data.fullName}.</h2>
          <p>
            Here is what is happening across your campus today. Use the workspace
            navigation to manage notices, complaints and lost items.
          </p>
        </div>
        <div className="hero-badge">
          <Icon name="shield" size={17} />
          Signed in as {data.role}
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <div className="stat-top">
              <span className="stat-icon">
                <Icon name={stat.icon} size={18} />
              </span>
              <Badge tone="violet">Live</Badge>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-foot">{stat.foot}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Operational summary</h3>
              <p className="card-sub">Progress across active campus workflows</p>
            </div>
            <Badge tone="blue">Realtime</Badge>
          </div>
          {progress.map((row) => (
            <div className="progress-row" key={row.label}>
              <div className="progress-label">
                <span>{row.label}</span>
                <strong>{row.value}%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${row.value}%` }} />
              </div>
              <div className="stat-foot">{row.detail}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Your activity</h3>
              <p className="card-sub">Items connected to your account</p>
            </div>
            <Icon name="users" size={18} className="muted" />
          </div>
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr', marginBottom: 0 }}>
            {personal.map((item) => (
              <div className="quick-item" key={item.label}>
                <span className="stat-icon">
                  <Icon name={item.icon} size={16} />
                </span>
                <span>{item.label}</span>
                <strong style={{ marginLeft: 'auto' }}>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <div>
            <h3 className="card-title">Quick actions</h3>
            <p className="card-sub">Jump straight into a workspace module</p>
          </div>
        </div>
        <div className="quick-list">
          {shortcuts.map((item) => (
            <Link className="quick-item" to={item.to} key={item.to}>
              <Icon name={item.icon} size={17} />
              {item.label}
              <Icon name="arrow" size={16} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
