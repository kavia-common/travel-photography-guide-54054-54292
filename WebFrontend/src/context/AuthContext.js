/**
 * AuthContext provides user state, login/logout, and loading/error info.
 */
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthAPI } from '../services/api';

// shape: { user, login, logout, loading, error }
const AuthContext = React.createContext({
  user: null,
  login: async () => {},
  socialLogin: async () => {},
  logout: async () => {},
  loading: false,
  error: null,
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Initialize from token, if exists
  React.useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.sub || decoded.user_id || decoded.id,
          email: decoded.email,
          name: decoded.name || decoded.username || '',
          avatar: decoded.avatar || '',
        });
      } catch {
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  // PUBLIC_INTERFACE
  async function login({ email, password }) {
    setLoading(true); setError(null);
    try {
      const data = await AuthAPI.login({ email, password });
      // Try infer user from response if provided
      if (data?.user) setUser(data.user);
      else if (data?.token) {
        const decoded = jwtDecode(data.token);
        setUser({
          id: decoded.sub || decoded.user_id || decoded.id,
          email: decoded.email || email,
          name: decoded.name || decoded.username || '',
          avatar: decoded.avatar || '',
        });
      } else {
        // Cookie-based session, we might need a /me endpoint; assume minimal
        setUser({ email });
      }
      return { ok: true };
    } catch (e) {
      setError(e.message || 'Login failed');
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function socialLogin({ provider, token }) {
    setLoading(true); setError(null);
    try {
      const data = await AuthAPI.login({ email: 'social@placeholder', provider, token });
      if (data?.user) setUser(data.user);
      else if (data?.token) {
        const decoded = jwtDecode(data.token);
        setUser({
          id: decoded.sub || decoded.user_id || decoded.id,
          email: decoded.email,
          name: decoded.name || '',
          avatar: decoded.avatar || '',
        });
      } else {
        setUser({ email: 'social@placeholder' });
      }
      return { ok: true };
    } catch (e) {
      setError(e.message || 'Social login failed');
      return { ok: false, error: e };
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function logout() {
    await AuthAPI.logout();
    setUser(null);
  }

  const value = { user, login, socialLogin, logout, loading, error };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  return React.useContext(AuthContext);
}
