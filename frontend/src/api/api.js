import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
});

// Used solely to renew an expired JWT. Kept in browser storage (never in
// source control) and cleared only on an explicit logout or a failed renewal.
const CREDENTIALS_KEY = 'sc_session_credentials';

function loadCredentials() {
  try {
    const raw =
      sessionStorage.getItem(CREDENTIALS_KEY) ||
      localStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let credentials = loadCredentials();
let renewalInFlight = null;

export function rememberCredentials(email, password) {
  credentials = { email, password };
  const serialized = JSON.stringify(credentials);
  sessionStorage.setItem(CREDENTIALS_KEY, serialized);
  localStorage.setItem(CREDENTIALS_KEY, serialized);
}

export function forgetCredentials() {
  credentials = null;
  sessionStorage.removeItem(CREDENTIALS_KEY);
  localStorage.removeItem(CREDENTIALS_KEY);
}

function clearSession() {
  localStorage.removeItem('token');
  forgetCredentials();
}

function isAuthCall(url = '') {
  return url.includes('/auth/login') || url.includes('/auth/register');
}

function tokenIsExpired(token) {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    // Renew 30 seconds early so a request never leaves with a dead token.
    return !payload.exp || payload.exp * 1000 <= Date.now() + 30_000;
  } catch {
    return true;
  }
}

async function renewToken() {
  if (!credentials) return false;

  if (!renewalInFlight) {
    renewalInFlight = axios
      .post(`${api.defaults.baseURL}/auth/login`, credentials)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        return true;
      })
      .catch(() => {
        clearSession();
        return false;
      })
      .finally(() => {
        renewalInFlight = null;
      });
  }

  return renewalInFlight;
}

api.interceptors.request.use(async (config) => {
  if (isAuthCall(config.url)) {
    return config;
  }

  let token = localStorage.getItem('token');

  if (token && tokenIsExpired(token)) {
    await renewToken();
    token = localStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (isAuthCall(original?.url) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried once — give up cleanly without forcing navigation.
    if (original?._retry || !(await renewToken())) {
      return Promise.reject(error);
    }

    original._retry = true;
    original.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

    return api(original);
  }
);

export default api;
