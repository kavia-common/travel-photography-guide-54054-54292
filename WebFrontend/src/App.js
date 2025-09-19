import React from 'react';
import './App.css';
import './styles.css';

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This SPA provides:
   * - A single location search input
   * - On submit or button click, fetch images from Unsplash for the query
   * - Display a responsive grid of images with basic loading/error states
   *
   * Configuration:
   * - Uses env var REACT_APP_UNSPLASH_ACCESS_KEY for the Unsplash API.
   *   The orchestrator should set this in the environment. Do not hardcode keys.
   */
  const [query, setQuery] = React.useState('');
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function fetchUnsplash(q) {
    const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      setError('Missing Unsplash API key. Please set REACT_APP_UNSPLASH_ACCESS_KEY in the environment.');
      return;
    }
    if (!q || !q.trim()) {
      setError('Please enter a location to search.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=30&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
            'Accept-Version': 'v1',
          },
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Unsplash error (${res.status})`);
      }
      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];
      setImages(results);
    } catch (e) {
      setError(e.message || 'Failed to fetch images.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    fetchUnsplash(query);
  }

  return (
    <div className="app-root">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="navbar" role="navigation" aria-label="Main navigation">
        <div className="brand" aria-label="Home">📸 Travel Photo Search</div>
      </header>

      <main id="main" className="container" tabIndex="-1">
        <div className="card" role="region" aria-label="Location search">
          <div className="card-header">
            <h1 style={{ margin: 0 }}>Find photos by location</h1>
          </div>
          <div className="card-body">
            <form onSubmit={onSubmit} aria-label="Search form" style={{ display: 'flex', gap: '.5rem' }}>
              <label htmlFor="q" className="sr-only">Location</label>
              <input
                id="q"
                className="input"
                type="text"
                placeholder="Type a location (e.g., Paris, Tokyo, Yosemite)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search location"
              />
              <button className="btn" type="submit" aria-label="Search photos">Search</button>
            </form>
            {loading && <div role="status" aria-live="polite" style={{ marginTop: '.75rem' }}>Loading…</div>}
            {error && !loading && (
              <div role="alert" style={{ marginTop: '.75rem', color: 'var(--danger)' }}>
                {error}
              </div>
            )}
          </div>
        </div>

        <section aria-labelledby="results-title" style={{ marginTop: '1rem' }}>
          <h2 id="results-title" className="sr-only">Results</h2>
          {(!loading && images.length === 0 && !error) ? (
            <p style={{ color: 'var(--text-muted)' }}>No results yet. Try searching for a location.</p>
          ) : null}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {images.map((img) => {
              const src = img.urls?.small || img.urls?.thumb || img.urls?.regular;
              const alt = img.alt_description || `Photo of ${query}`;
              const link = img.links?.html || img.urls?.regular;
              const user = img.user;
              return (
                <article key={img.id} className="card">
                  <a href={link} target="_blank" rel="noreferrer" aria-label="Open on Unsplash">
                    <img
                      src={src}
                      alt={alt}
                      style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                    />
                  </a>
                  <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '.9rem' }}>
                      <div style={{ fontWeight: 600 }}>{user?.name || 'Unknown'}</div>
                      <div style={{ color: 'var(--text-muted)' }}>@{user?.username}</div>
                    </div>
                    {user?.links?.html ? (
                      <a className="btn-secondary" href={user.links.html} target="_blank" rel="noreferrer" aria-label="Photographer on Unsplash">
                        Profile
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Images powered by Unsplash</p>
      </footer>
    </div>
  );
}
