# Travel Photo Search (Unsplash) - WebFrontend

A minimal single-page React app where users type a location and see images fetched from the Unsplash API.

## Features

- Single page with a location search input
- Fetches images from Unsplash Search API for the given location
- Responsive image grid with photographer attribution
- Basic loading and error states
- Accessible controls (skip link, labels, roles)

## Environment Variables

Create or configure the following environment variable (the orchestrator will set it during deployment):

- REACT_APP_UNSPLASH_ACCESS_KEY: Your Unsplash API Access Key.

Do not hardcode secrets in code.

## Scripts

- `npm start` - Start development server
- `npm test` - Run tests in CI mode
- `npm run build` - Create production build

## Notes

- All previous advanced features (maps, uploads, gallery, auth, etc.) have been removed in this refactor to focus solely on location-based image search via Unsplash.
- If you see an error about missing API key, ensure REACT_APP_UNSPLASH_ACCESS_KEY is set.
