
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message);

    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
); // <-- semicolon here was missing — caused "next is not a function"

// ─── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
};

// ─── Tasks API ─────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll:         (params)   => api.get('/tasks', { params }),
  getStats:       ()         => api.get('/tasks/stats'),
  getById:        (id)       => api.get(`/tasks/${id}`),
  create:         (data)     => api.post('/tasks', data),
  update:         (id, data) => api.put(`/tasks/${id}`, data),
  delete:         (id)       => api.delete(`/tasks/${id}`),
  clearCompleted: ()         => api.delete('/tasks'),
};

export default api;
