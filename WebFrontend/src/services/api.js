/**
 * API client using axios with proper auth handling (cookie or JWT) and error normalization.
 * Requires env var: REACT_APP_API_BASE_URL (provided by orchestrator).
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // enables cookieAuth if backend sets cookies
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Attach JWT bearer if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const normalized = {
      status: error.response?.status || 0,
      message: error.response?.data?.message || error.message || 'Network error',
      data: error.response?.data,
    };
    return Promise.reject(normalized);
  }
);

/**
 * PUBLIC_INTERFACE
 * Auth API operations: login, logout, getCurrentUser (optional).
 */
export const AuthAPI = {
  /** Email/password or social login (provider+token). */
  async login(payload) {
    // payload: { email, password?, provider?, token? }
    const res = await api.post('/api/auth/login', payload);
    // If returns JWT, store it; otherwise rely on cookies.
    const maybeToken = res.data?.token;
    if (maybeToken) {
      localStorage.setItem('auth_token', maybeToken);
    }
    return res.data;
  },
  async logout() {
    // Clear local token; if backend has /logout endpoint, call it.
    localStorage.removeItem('auth_token');
    try { await api.post('/api/auth/logout'); } catch { /* optional */ }
  },
};

/**
 * PUBLIC_INTERFACE
 * Photos API operations.
 */
export const PhotosAPI = {
  async list({ location, tags, view } = {}) {
    const params = {};
    if (location) params.location = location;
    if (tags) params.tags = tags;
    if (view) params.view = view;
    const res = await api.get('/api/photos', { params });
    return res.data;
  },
  async upload({ file, title, description, location, tags }) {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', title);
    if (description) form.append('description', description);
    form.append('location', location);
    if (tags) form.append('tags', tags);
    const res = await api.post('/api/photos', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async edit(photoId, payload) {
    const res = await api.patch(`/api/photos/${encodeURIComponent(photoId)}`, payload);
    return res.data;
  },
};

/**
 * PUBLIC_INTERFACE
 * Comments API.
 */
export const CommentsAPI = {
  async add({ photoId, comment }) {
    const res = await api.post('/api/comments', { photoId, comment });
    return res.data;
  },
};

/**
 * PUBLIC_INTERFACE
 * Share API.
 */
export const ShareAPI = {
  async share({ photoId, platform }) {
    const res = await api.post('/api/share', { photoId, platform });
    return res.data;
  },
};
