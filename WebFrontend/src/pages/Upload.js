import React from 'react';
import { PhotosAPI } from '../services/api';
import { useI18n } from '../i18n/i18n';

/**
 * PUBLIC_INTERFACE
 * Upload allows photo upload with metadata and privacy selection.
 */
export default function Upload() {
  const { t } = useI18n();
  const [file, setFile] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !location) {
      setStatus('File and location are required');
      return;
    }
    setSubmitting(true);
    setStatus('');
    try {
      await PhotosAPI.upload({ file, title, description, location, tags });
      setStatus('Upload successful');
      setFile(null); setTitle(''); setDescription(''); setLocation(''); setTags('');
    } catch (e) {
      setStatus(e.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <form className="card" onSubmit={handleSubmit} aria-labelledby="upload-title">
        <div className="card-header">
          <h2 id="upload-title" style={{ margin: 0 }}>{t('upload.title')}</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr' }}>
            <label>
              {t('upload.select_file')}
              <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            <label>
              {t('upload.location')}
              <input className="input" type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </label>
            <label>
              Title
              <input className="input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
              {t('upload.tags')}
              <input className="input" type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
            </label>
            <label>
              {t('upload.description')}
              <textarea className="input" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button className="btn" type="submit" disabled={submitting}>{t('upload.submit')}</button>
          </div>
          {status && <div role="status" aria-live="polite" style={{ marginTop: '.5rem' }}>{status}</div>}
        </div>
      </form>
    </div>
  );
}
