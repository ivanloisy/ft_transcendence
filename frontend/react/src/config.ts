export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

export const WS_URL =
  process.env.REACT_APP_WS_URL || BACKEND_URL;

export const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080');

export const getApiUrl = (endpoint: string): string => {
  if (!endpoint) return BACKEND_URL;
  if (endpoint.startsWith('http://localhost:3000')) {
    return endpoint.replace('http://localhost:3000', BACKEND_URL);
  }
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  return `${BACKEND_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};
