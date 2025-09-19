import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PhotosAPI } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [photos, setPhotos] = React.useState([]);

  React.useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await PhotosAPI.list({ view: 'grid' });
        if (!ignore) setPhotos(data?.photos || data || []);
      } catch {
        if (!ignore) setPhotos([]);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--border)' }} />
            <div>
              <h2 style={{ margin: 0 }}>{user?.name || user?.email || 'User'}</h2>
              <div style={{ color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button className="btn-secondary">Follow</button>
            </div>
          </div>
          <h3>Your Photos</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {photos.map((p, idx) => (
              <div key={p.id || idx} className="card">
                <img src={p.url || 'https://picsum.photos/400'} alt={p.title || 'Photo'} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div className="card-body">
                  <div style={{ fontWeight: 600 }}>{p.title || 'Untitled'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{p.location || ''}</div>
                </div>
              </div>
            ))}
            {photos.length === 0 && <div>No photos yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
