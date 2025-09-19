import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import './styles.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider, useI18n } from './i18n/i18n';
import Notifications from './components/Notifications';
import MapExplorer from './pages/MapExplorer';
import Gallery from './pages/Gallery';
import Upload from './pages/Upload';
import PhotoDetail from './pages/PhotoDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

/**
 * PUBLIC_INTERFACE
 * AppShell renders navigation, theming, i18n controls, and main routes.
 */
function AppShell() {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="app-root" data-theme={theme}>
      <a className="skip-link" href="#main">{t('a11y.skip_to_content')}</a>
      <header className="navbar" role="navigation" aria-label={t('nav.main')}>
        <div className="navbar-left">
          <Link to="/" className="brand" aria-label={t('nav.home')}>
            🌍 Travel Photo Guide
          </Link>
          <nav className="nav-links">
            <Link to="/map">{t('nav.map')}</Link>
            <Link to="/gallery">{t('nav.gallery')}</Link>
            <Link to="/upload">{t('nav.upload')}</Link>
          </nav>
        </div>
        <div className="navbar-right">
          <select
            aria-label={t('nav.language')}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <button className="btn" onClick={toggleTheme} aria-label={t('nav.toggle_theme')}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <>
              <Link to="/profile" className="btn-secondary">{t('nav.profile')}</Link>
              <button onClick={logout} className="btn">{t('auth.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">{t('auth.login')}</Link>
              <Link to="/register" className="btn-secondary">{t('auth.register')}</Link>
            </>
          )}
          <Link to="/settings" className="icon-btn" aria-label={t('nav.settings')}>⚙️</Link>
        </div>
      </header>
      <Notifications />
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/upload" element={<RequireAuth><Upload /></RequireAuth>} />
          <Route path="/photo/:photoId" element={<PhotoDetail />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<div className="container"><h1>{t('errors.not_found')}</h1></div>} />
        </Routes>
      </main>
      <footer className="footer">
        <p>{t('footer.copy')}</p>
      </footer>
    </div>
  );
}

/**
 * Theme hook and provider kept minimal and accessible.
 */
const ThemeContext = React.createContext({ theme: 'light', toggleTheme: () => {} });
function useTheme() {
  return React.useContext(ThemeContext);
}
function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState('light');
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * RequireAuth guards routes for authenticated users.
 */
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/**
 * PUBLIC_INTERFACE
 * App entry - wraps providers and router.
 */
function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
