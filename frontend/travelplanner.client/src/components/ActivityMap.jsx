import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet podrazumevane ikone ne rade sa bundlerom (Vite), pa pravimo svoju.
function numberedIcon(number, color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background:${color};
      width:28px;height:28px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:2px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);color:#fff;font-weight:700;font-size:13px;">${number}</span>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export default function ActivityMap({ activities }) {
  // Samo aktivnosti sa koordinatama, sortirane po datumu pa vremenu.
  const located = activities
    .filter((a) => a.latitude != null && a.longitude != null)
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (da !== db) return da - db;
      return (a.time ?? '').localeCompare(b.time ?? '');
    });

  if (located.length === 0) {
    return (
      <div className="map-empty">
        <p>Nijedna aktivnost nema unetu lokaciju.</p>
        <p className="overview-muted">
          Dodaj koordinate aktivnostima (preko dugmeta „Pronađi" u formi) da bi se prikazale na mapi.
        </p>
      </div>
    );
  }

  // Centar mape = prva aktivnost. Linija rute = svi u nizu.
  const center = [located[0].latitude, located[0].longitude];
  const routePositions = located.map((a) => [a.latitude, a.longitude]);

  return (
    <div className="activity-map">
      <MapContainer center={center} zoom={12} style={{ height: '500px', borderRadius: '14px' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ruta kretanja - linija koja povezuje aktivnosti redom */}
        <Polyline
          positions={routePositions}
          pathOptions={{ color: '#0e7c86', weight: 3, opacity: 0.7, dashArray: '8, 8' }}
        />

        {/* Markeri, numerisani po redosledu */}
        {located.map((a, index) => (
          <Marker
            key={a.id}
            position={[a.latitude, a.longitude]}
            icon={numberedIcon(index + 1, a.statusInfo.color)}
          >
            <Popup>
              <strong>{a.name}</strong>
              <br />
              {a.dateLabel}{a.timeLabel && ` u ${a.timeLabel}`}
              {a.location && <><br />{a.location}</>}
              <br />
              <span style={{ color: a.statusInfo.color }}>{a.statusInfo.label}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="map-legend">
        <span className="overview-muted">
          Ruta kretanja kroz {located.length} {located.length === 1 ? 'lokaciju' : 'lokacija'} — brojevi prate redosled po danima.
        </span>
      </div>
    </div>
  );
}