import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to include the Firebase ID token
api.interceptors.request.use(async (config) => {
  const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

  // Try to get token from Firebase (or Mock)
  try {
    if (IS_MOCK) {
      const isClient = typeof window !== 'undefined';
      const mockUserStr = isClient ? localStorage.getItem('mock_user') : null;
      if (mockUserStr) {
        const { role } = JSON.parse(mockUserStr);
        config.headers.Authorization = `Bearer mock-token-${role}`;
      } else {
        // Default to faculty if someone is trying to create an exam in mock mode
        config.headers.Authorization = `Bearer mock-token-faculty`;
      }
    } else {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('[API-Interceptor] Error getting token:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
