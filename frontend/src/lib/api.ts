import axios from 'axios';
import { store } from '../app/store';
import { logout, setTokens } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — try refresh, then logout
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = store.getState().auth.refreshToken;
        if (!refreshToken) throw new Error('No refresh token');
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
        store.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
