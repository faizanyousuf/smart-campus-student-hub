import { useEffect, useState } from 'react';
import api from '../../api/api.js';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  const cards = [
    ['Notices', data.totalNotices],
    ['Complaints', data.totalComplaints],
    ['Open complaints', data.openComplaints],
    ['Lost & found items', data.totalLostItems],
    ['Open items', data.openLostItems],
    ['Pending claims', data.pendingClaims],
    ['My complaints', data.myComplaints],
    ['My claims', data.myClaims],
    ['My reported items', data.myLostItems]
  ];

  return (
    <section>
      <h2>Dashboard</h2>
      <p>
        Welcome, <strong>{data.fullName}</strong> ({data.role})
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginTop: 16
        }}
      >
        {cards.map(([label, value]) => (
          <div
            key={label}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
            <div>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
