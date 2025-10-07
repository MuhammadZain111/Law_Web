// Normalize API base: accept values like ":5000" or "localhost:5000" and add protocol/host
let API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:5000';
console.log("API_BASE", API_BASE);
if (!/^https?:\/\//i.test(API_BASE)) {
  if (API_BASE.startsWith(':')) {
    API_BASE = `http://localhost${API_BASE}`;
  } else {
    API_BASE = `http://${API_BASE}`;
  }
}
API_BASE = API_BASE.replace(/\/$/, '');
// If someone set VITE_API_BASE to include /api, strip it to avoid /api/api duplication
API_BASE = API_BASE.replace(/\/(api)$/, '');
const BASE_URL = `${API_BASE}/api`;

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.error || 'Request failed';
    throw new Error(message);
  }
  return { data };
}

export const api = {
  get: (path, options) => request(path, { method: 'GET', ...(options || {}) }),
  post: (path, body, options) => request(path, { method: 'POST', body, ...(options || {}) }),
  put: (path, body, options) => request(path, { method: 'PUT', body, ...(options || {}) }),
  patch: (path, body, options) => request(path, { method: 'PATCH', body, ...(options || {}) }),
  delete: (path, options) => request(path, { method: 'DELETE', ...(options || {}) }),
};

export function setAuthToken(token) {
  if (token) {
    try { localStorage.setItem('token', token); } catch (_e) {}
  } else {
    try { localStorage.removeItem('token'); } catch (_e) {}
  }
}

export default api;


