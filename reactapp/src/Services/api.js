// api.js
import axios from 'axios';

const api = axios.create({
  // Use the Examly URL
  baseURL: "https://8080-eaecfaabfcdbbccabcfcbfaabdbcabfebaccfcccce.premiumproject.examly.io/api",
  withCredentials: true,
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
    
    // Check for 401 or 403 (depending on your backend refresh trigger)
    if ((error.response?.status === 403 || error.response?.status === 401) && !prevRequest._retry) {
      prevRequest._retry = true;
      try {
        // FIX: Use the 'api' instance or a relative path, NOT localhost
        const res = await api.get("/user/refresh"); 
        
        accessToken = res.data.accessToken;
        
        // Update the header and retry the original request
        prevRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(prevRequest);
      } catch (refreshErr) {
        // If refresh fails, clear everything
        accessToken = null;
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;