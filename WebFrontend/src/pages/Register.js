import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/i18n';

export default function Register() {
  const { t } = useI18n();
  const { login, loading } = useAuth();
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    // NOTE: No /register endpoint defined in spec; depending on backend, this should call signup API.
    // For now, fallback to login to continue UX.
    const res = await login({ email, password });
    if (res.ok) navigate('/map', { replace: true });
    else setStatus(res.error?.message || 'Registration failed');
  }

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit} aria-labelledby="register-title">
        <div className="card-header">
          <h2 id="register-title" style={{ margin: 0 }}>{t('auth.register')}</h2>
        </div>
        <div className="card-body" style={{ display: 'grid', gap: '1rem' }}>
          <label>{t('auth.name')}
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>{t('auth.email')}
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>{t('auth.password')}
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn" type="submit" disabled={loading}>{t('auth.register')}</button>
          {status && <div role="status" aria-live="polite" style={{ color: 'var(--danger)' }}>{status}</div>}
        </div>
      </form>
    </div>
  );
}
