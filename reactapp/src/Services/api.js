import axios from 'axios';

const BACKEND_URL = "https://8080-fdadabacebccabcfcbfaabdbcabfebaccfcccce.premiumproject.examly.io";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true, // Required to send/receive cookies
  
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// ── Response interceptor – silent token refresh ──────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const prev = error.config;
    if (error.response?.status === 403 && !prev._retry) {
      prev._retry = true;
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/refresh`, { withCredentials: true });
        accessToken = res.data.accessToken;
        prev.headers.Authorization = `Bearer ${accessToken}`;
        return api(prev);
      } catch {
        clearAccessToken();
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;