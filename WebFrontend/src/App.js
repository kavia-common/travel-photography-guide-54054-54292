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
  const [hasSearched, setHasSearched] = React.useState(false);

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
    setHasSearched(true);
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
    <div className="app-root soft-bg">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="navbar frosted" role="navigation" aria-label="Main navigation">
        <div className="brand" aria-label="Home">📸 Travel Photo Search</div>
        <a
          className="icon-btn"
          href="https://unsplash.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Unsplash"
          title="Unsplash"
        >
          Unsplash
        </a>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Find your next photo adventure</h1>
          <p className="hero-subtitle">
            Type a place and discover stunning photography from around the world.
          </p>

          <form onSubmit={onSubmit} aria-label="Search form" className="searchbar">
            <label htmlFor="q" className="sr-only">Location</label>
            <input
              id="q"
              className="input input-lg"
              type="text"
              placeholder="Try “Paris”, “Tokyo”, or “Yosemite”"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search location"
            />
            <button className="btn btn-lg" type="submit" aria-label="Search photos">
              Search
            </button>
          </form>

          {loading && (
            <div role="status" aria-live="polite" className="fade-in" style={{ marginTop: '.75rem' }}>
              Loading…
            </div>
          )}
          {error && !loading && (
            <div role="alert" className="error-chip fade-in">
              {error}
            </div>
          )}
        </div>
        <div className="hero-accent" aria-hidden="true" />
      </section>

      <main id="main" className="container" tabIndex="-1">
        <section aria-labelledby="results-title" style={{ marginTop: '1rem' }}>
          <h2 id="results-title" className="sr-only">Results</h2>
          {!loading && images.length === 0 && !error && !hasSearched ? (
            <p className="muted center">
              Start with a location above to see beautiful photos.
            </p>
          ) : null}
          {!loading && images.length === 0 && !error && hasSearched ? (
            <p className="muted">No results found. Try a different place.</p>
          ) : null}

          <div className="masonry-grid">
            {images.map((img) => {
              const src = img.urls?.small || img.urls?.thumb || img.urls?.regular;
              const alt = img.alt_description || `Photo of ${query}`;
              const link = img.links?.html || img.urls?.regular;
              const user = img.user;
              return (
                <article key={img.id} className="photo-card fade-in">
                  <a href={link} target="_blank" rel="noreferrer" aria-label="Open on Unsplash" className="image-wrap">
                    <img
                      src={src}
                      alt={alt}
                      loading="lazy"
                      className="photo-img"
                    />
                    <span className="image-overlay">View on Unsplash</span>
                  </a>
                  <div className="photo-meta">
                    <div className="author">
                      <div className="author-name">{user?.name || 'Unknown'}</div>
                      <div className="author-username">@{user?.username}</div>
                    </div>
                    {user?.links?.html ? (
                      <a
                        className="btn-secondary mini"
                        href={user.links.html}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Photographer on Unsplash"
                      >
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

      <footer className="footer soft-footer">
        <p className="muted">
          Photos powered by <a className="link" href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>. 
          <span> Built for travel lovers.</span>
        </p>
        <div className="footer-links">
          <a className="link" href="https://unsplash.com/license" target="_blank" rel="noreferrer">License</a>
          <a className="link" href="https://unsplash.com/terms" target="_blank" rel="noreferrer">Terms</a>
        </div>
      </footer>
    </div>
  );
}
