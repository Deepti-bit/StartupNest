import axios from 'axios';

const api = axios.create({
  baseURL: "https://8080-eaecfaabfcdbbccabcfcbfaabdbcabfebaccfcccce.premiumproject.examly.io/api",
  withCredentials: true, // Required to send/receive cookies
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;
    if (error.response?.status === 403 && !prevRequest._retry) {
      prevRequest._retry = true;
      try {
        const res = await axios.get("http://localhost:8080/api/user/refresh", { withCredentials: true });
        accessToken = res.data.accessToken;
        prevRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(prevRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;