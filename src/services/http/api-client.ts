import axios, { AxiosError } from 'axios';
import { clearAuthSession, getAccessToken } from '@/features/auth/utils/auth-storage';

const authRedirectIgnoredPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/confirm-email',
];

function redirectToLogin(): void {
  if (typeof window === 'undefined') {
    return;
  }

  clearAuthSession();

  if (window.location.pathname !== '/login') {
    window.location.assign('/login?reason=session-expired');
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !authRedirectIgnoredPaths.some((path) => error.config?.url?.includes(path))
    ) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
