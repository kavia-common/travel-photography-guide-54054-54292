import React from 'react';
import { useParams } from 'react-router-dom';
import { PhotosAPI, CommentsAPI, ShareAPI } from '../services/api';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../context/AuthContext';

export default function PhotoDetail() {
  const { photoId } = useParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const [photo, setPhoto] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ title: '', description: '', location: '', tags: '', privacy: 'public' });
  const [comment, setComment] = React.useState('');
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    let ignore = false;
    async function load() {
      // No GET /api/photos/{id} in spec; reuse list and filter client-side as placeholder.
      try {
        const data = await PhotosAPI.list({});
        const found = (data?.photos || data || []).find((p) => String(p.id) === String(photoId)) || {
          id: photoId, url: 'https://picsum.photos/1200/800', title: 'Sample Photo', description: 'Sample description', location: 'Unknown', tags: 'sample', privacy: 'public',
        };
        if (!ignore) {
          setPhoto(found);
          setForm({
            title: found.title || '',
            description: found.description || '',
            location: found.location || '',
            tags: found.tags || '',
            privacy: found.privacy || 'public',
          });
        }
      } catch {
        /* ignore */
      }
    }
    load();
    return () => { ignore = true; };
  }, [photoId]);

  async function saveMeta() {
    setStatus('');
    try {
      await PhotosAPI.edit(photoId, form);
      setPhoto({ ...photo, ...form });
      setEditing(false);
      setStatus('Saved');
    } catch (e) {
      setStatus(e.message || 'Error saving');
    }
  }

  async function addComment() {
    if (!comment.trim()) return;
    setStatus('');
    try {
      await CommentsAPI.add({ photoId, comment });
      setStatus('Comment added');
      setComment('');
    } catch (e) {
      setStatus(e.message || 'Error commenting');
    }
  }

  async function share(platform) {
    setStatus('');
    try {
      await ShareAPI.share({ photoId, platform });
      setStatus('Shared');
    } catch (e) {
      setStatus(e.message || 'Error sharing');
    }
  }

  if (!photo) return <div className="container"><div role="status">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <img src={photo.url || 'https://picsum.photos/1200/800'} alt={photo.title || 'Photo'} style={{ width: '100%', borderRadius: '.5rem' }} />
          <div style={{ marginTop: '1rem', display: 'grid', gap: '.5rem' }}>
            {!editing ? (
              <>
                <h2 style={{ margin: 0 }}>{photo.title}</h2>
                <div style={{ color: 'var(--text-muted)' }}>{photo.location} • {photo.tags}</div>
                <p>{photo.description}</p>
                <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                  <button className="btn-secondary" onClick={() => setEditing(true)}>{t('photo.edit')}</button>
                  <button className="btn-secondary" onClick={() => share('twitter')}>{t('photo.share')} Twitter</button>
                  <button className="btn-secondary" onClick={() => share('facebook')}>{t('photo.share')} Facebook</button>
                  <button className="btn">👍 {t('photo.like')}</button>
                  <button className="btn-secondary">⭐ {t('photo.favorite')}</button>
                </div>
              </>
            ) : (
              <div className="card" style={{ padding: '1rem' }}>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label>Title<input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
                  <label>{t('photo.privacy')}
                    <select className="input" value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value })}>
                      <option value="public">{t('photo.public')}</option>
                      <option value="private">{t('photo.private')}</option>
                    </select>
                  </label>
                  <label>Location<input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
                  <label>Tags<input className="input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
                  <label style={{ gridColumn: 'span 2' }}>Description<textarea className="input" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
                  <button className="btn" onClick={saveMeta}>{t('photo.save')}</button>
                  <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            )}
            <div className="card" style={{ padding: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>Comments</h3>
              {user ? (
                <div style={{ display: 'grid', gap: '.5rem' }}>
                  <textarea
                    className="input"
                    rows="3"
                    value={comment}
                    placeholder={t('photo.comment.placeholder')}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn-secondary" onClick={addComment}>{t('photo.comment.submit')}</button>
                </div>
              ) : (
                <div>Please log in to comment.</div>
              )}
            </div>
            {status && <div role="status" aria-live="polite">{status}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
