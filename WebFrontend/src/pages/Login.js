import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/i18n';

export default function Login() {
  const { t } = useI18n();
  const { login, socialLogin, loading, error } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('');
    const res = await login({ email, password });
    if (res.ok) navigate('/map', { replace: true });
    else setStatus(res.error?.message || 'Login failed');
  }

  async function handleSocial(provider) {
    setStatus('');
    // In real app, trigger OAuth flow; here, accept a placeholder token.
    const res = await socialLogin({ provider, token: 'OAUTH_TOKEN_PLACEHOLDER' });
    if (res.ok) navigate('/map', { replace: true });
    else setStatus(res.error?.message || 'Login failed');
  }

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit} aria-labelledby="login-title">
        <div className="card-header">
          <h2 id="login-title" style={{ margin: 0 }}>{t('auth.login')}</h2>
        </div>
        <div className="card-body" style={{ display: 'grid', gap: '1rem' }}>
          <label>{t('auth.email')}
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>{t('auth.password')}
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          <button className="btn" type="submit" disabled={loading}>{t('auth.login')}</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{t('auth.or')}</span>
            <button type="button" className="btn-secondary" onClick={() => handleSocial('google')}>{t('auth.login_with')} Google</button>
            <button type="button" className="btn-secondary" onClick={() => handleSocial('facebook')}>{t('auth.login_with')} Facebook</button>
          </div>
          {(error || status) && <div role="status" aria-live="polite" style={{ color: 'var(--danger)' }}>{error || status}</div>}
        </div>
      </form>
    </div>
  );
}
