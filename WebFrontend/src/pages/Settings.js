import React from 'react';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../context/AuthContext';

// Theme managed in App via ThemeProvider; expose a simple consumer hook
const ThemeContext = React.createContext({ theme: 'light', toggleTheme: () => {} });
export function useTheme() { return React.useContext(ThemeContext); }

export default function Settings() {
  const { t, language, setLanguage } = useI18n();
  const [theme, setThemeState] = React.useState(document.documentElement.getAttribute('data-theme') || 'light');

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    setThemeState(next);
  }

  return (
    <div className="container">
      <div className="card" aria-labelledby="settings-title">
        <div className="card-header">
          <h2 id="settings-title" style={{ margin: 0 }}>{t('settings.title')}</h2>
        </div>
        <div className="card-body" style={{ display: 'grid', gap: '1rem', maxWidth: 420 }}>
          <label>
            {t('nav.language')}
            <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
          <div>
            <button className="btn-secondary" onClick={toggleTheme}>{t('nav.toggle_theme')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
