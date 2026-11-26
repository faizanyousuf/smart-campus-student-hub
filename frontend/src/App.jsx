import { useEffect, useState } from 'react';
import api from './api/api.js';

function App() {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/notices')
      .then((response) => setNotices(response.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Smart Campus Student Hub</h1>
      <p>Rebuild Stage 9 - React + API helper</p>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <h2>Notices</h2>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>{notice.title}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
