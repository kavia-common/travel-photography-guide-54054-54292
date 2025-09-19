# Travel Photography Guide - WebFrontend

This React app implements:
- World map exploration with hotspots (Leaflet), pan/zoom, and location selection.
- Search with autocomplete/suggestions.
- Gallery browsing with grid/list views and toggling between map and gallery.
- Photo uploads with metadata and tags.
- Edit photo metadata and privacy.
- Authentication (email, social/OAuth placeholder flows), profile page.
- Interactions: comment, like, favorite (UI), share to social via API.
- Real-time notifications via WebSocket (optional).
- Accessibility: WCAG 2.1 AA-conscious controls, skip link, ARIA annotations, focus outlines.
- Internationalization: English and Spanish with runtime switching.
- Responsive layout using simple CSS grid and cards.

Configuration:
- Copy `.env.example` to configure `REACT_APP_API_BASE_URL`, `REACT_APP_WS_URL`, `REACT_APP_SITE_URL` via deployment environment.
- The frontend integrates with the following backend endpoints (per OpenAPI):
  - POST `/api/auth/login`
  - GET `/api/photos`
  - POST `/api/photos`
  - PATCH `/api/photos/{photoId}`
  - POST `/api/comments`
  - POST `/api/share`

Notes:
- Registration endpoint is not defined by the provided spec; the Register page uses login as a placeholder. Update to call your real signup route if available.
- If backend uses cookie sessions, leave JWT unset; otherwise, when `/api/auth/login` returns `token`, it will be persisted in localStorage and attached as `Authorization: Bearer`.
