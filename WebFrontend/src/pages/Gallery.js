import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PhotosAPI } from '../services/api';
import { useI18n } from '../i18n/i18n';

function PhotoCard({ photo, view }) {
  return (
    <div className={`card ${view === 'list' ? 'list-card' : ''}`}>
      <div className="card-body">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', alignItems: 'center' }}>
          <div style={{ gridColumn: 'span 3' }}>
            <img src={photo.url || photo.thumbnail || 'https://picsum.photos/300'} alt={photo.title || 'Photo'} style={{ width: '100%', borderRadius: '.5rem' }} />
          </div>
          <div style={{ gridColumn: 'span 9' }}>
            <h3 style={{ margin: 0 }}>{photo.title || 'Untitled'}</h3>
            <p style={{ margin: '.25rem 0', color: 'var(--text-muted)' }}>{photo.description || ''}</p>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              <Link to={`/photo/${photo.id || photo._id || '1'}`} className="btn-secondary">Open</Link>
              <Link to={`/profile?user=${photo.userId || 'me'}`} className="btn-secondary">Author</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Gallery supports grid/list view and filters by location/tags via query params.
 */
export default function Gallery() {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const [photos, setPhotos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const view = params.get('view') || 'grid';
  const location = params.get('location') || '';
  const tags = params.get('tags') || '';

  React.useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await PhotosAPI.list({ location, tags, view });
        if (ignore) return;
        setPhotos(data?.photos || data || []);
      } catch {
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [location, tags, view]);

  function setView(next) {
    params.set('view', next);
    setParams(params, { replace: true });
  }

  return (
    <div className="container">
      <div className="card" role="region" aria-label="Photo gallery">
        <div className="card-header" style={{ display: 'flex', gap: '.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <strong>Gallery</strong>
            {(location || tags) ? <span style={{ marginLeft: '.5rem', color: 'var(--text-muted)' }}>Filters: {location} {tags}</span> : null}
          </div>
          <div role="group" aria-label="View switcher" style={{ display: 'inline-flex', gap: '.5rem' }}>
            <button className="btn-secondary" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>{t('gallery.view_grid')}</button>
            <button className="btn-secondary" aria-pressed={view === 'list'} onClick={() => setView('list')}>{t('gallery.view_list')}</button>
          </div>
        </div>
        <div className="card-body">
          {loading && <div role="status" aria-live="polite">Loading...</div>}
          {!loading && photos.length === 0 && <p>No photos found.</p>}
          {view === 'grid' ? (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {photos.map((p, idx) => (
                <Link key={p.id || idx} to={`/photo/${p.id || idx}`} className="card">
                  <img src={p.url || p.thumbnail || 'https://picsum.photos/400'} alt={p.title || 'Photo'} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  <div className="card-body">
                    <div style={{ fontWeight: 600 }}>{p.title || 'Untitled'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{p.location || ''}</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
              {photos.map((p, idx) => (
                <PhotoCard key={p.id || idx} photo={p} view="list" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
