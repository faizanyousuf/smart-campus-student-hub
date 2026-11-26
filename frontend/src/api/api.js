import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
});

// Tab-scoped only: survives a refresh but is never written to localStorage
// or committed to the repository. Used solely to renew an expired JWT.
const CREDENTIALS_KEY = 'sc_session_credentials';

function loadCredentials() {
  try {
    const raw = sessionStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let credentials = loadCredentials();

export function rememberCredentials(email, password) {
  credentials = { email, password };
  sessionStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

export function forgetCredentials() {
  credentials = null;
  sessionStorage.removeItem(CREDENTIALS_KEY);
}

function sessionExpired() {
  localStorage.removeItem('token');
  forgetCredentials();
  window.dispatchEvent(new CustomEvent('auth:session-expired'));
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register');

    if (isAuthCall) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried once — give up cleanly.
    if (original?._retry) {
      sessionExpired();
      return Promise.reject(error);
    }

    // Session restored from localStorage only: no credentials to renew with.
    if (!credentials) {
      sessionExpired();
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/login`,
        credentials
      );

      localStorage.setItem('token', response.data.token);
      original.headers.Authorization = `Bearer ${response.data.token}`;

      return api(original);
    } catch (retryError) {
      sessionExpired();
      return Promise.reject(error);
    }
  }
);

export default api;
