import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import '../leaflet-fix';
import 'leaflet/dist/leaflet.css';
import { PhotosAPI } from '../services/api';
import { useI18n } from '../i18n/i18n';
import SearchBar from '../components/SearchBar';

const defaultCenter = [20, 0];
const defaultZoom = 2;

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick?.(e.latlng);
    },
  });
  return null;
}

const cameraIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -28],
});

/**
 * PUBLIC_INTERFACE
 * MapExplorer allows users to browse world map, view hotspots (photos grouped by location), and search.
 */
export default function MapExplorer() {
  const { t } = useI18n();
  const [center, setCenter] = React.useState(defaultCenter);
  const [zoom, setZoom] = React.useState(defaultZoom);
  const [query, setQuery] = React.useState('');
  const [hotspots, setHotspots] = React.useState([]); // [{id, lat, lng, count, sample}]
  const [loading, setLoading] = React.useState(false);

  // Load hotspots by querying backend with location search (approximate)
  React.useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await PhotosAPI.list({ location: query || '' });
        if (ignore) return;
        // Group by simplified lat/lng from photo metadata if provided; fallback to random demo.
        const groups = {};
        (data?.photos || data || []).forEach((p, idx) => {
          const lat = p.lat ?? ((idx * 13) % 70) - 35;
          const lng = p.lng ?? ((idx * 29) % 340) - 170;
          const key = `${Math.round(lat)},${Math.round(lng)}`;
          if (!groups[key]) groups[key] = { lat, lng, count: 0, sample: p };
          groups[key].count += 1;
        });
        setHotspots(Object.values(groups));
      } catch {
        setHotspots([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [query]);

  return (
    <div className="container">
      <div className="card" role="region" aria-label="Map explorer">
        <div className="card-header">
          <SearchBar value={query} onChange={setQuery} placeholder={t('search.placeholder')} />
        </div>
        <div className="card-body" style={{ height: '70vh' }}>
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            aria-label="World map"
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onClick={(latlng) => {
              setCenter([latlng.lat, latlng.lng]);
              setZoom(6);
            }} />
            {hotspots.map((h, i) => (
              <Marker key={i} position={[h.lat, h.lng]} icon={cameraIcon}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <div><strong>{h.count}</strong> photos</div>
                    {h.sample?.title ? <div>{h.sample.title}</div> : null}
                    <a className="btn-secondary" href={`/gallery?location=${encodeURIComponent(h.sample?.location || '')}`}>
                      Open gallery
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          {loading && <div role="status" aria-live="polite" style={{ marginTop: '.5rem' }}>Loading...</div>}
        </div>
      </div>
    </div>
  );
}
