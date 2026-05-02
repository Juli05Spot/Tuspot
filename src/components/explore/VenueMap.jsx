import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

// Fix leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createPriceIcon(price, isActive) {
  const formatted = `$${Number(price).toLocaleString("es-MX")}`;
  const bg = isActive ? "#F26B3C" : "#ffffff";
  const color = isActive ? "#ffffff" : "#1a1a1a";
  const shadow = isActive
    ? "0 4px 20px rgba(242,107,60,0.6), 0 2px 8px rgba(0,0,0,0.4)"
    : "0 4px 14px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.3)";
  const scale = isActive ? "scale(1.12)" : "scale(1)";

  return L.divIcon({
    className: "",
    html: `<div style="
      display:inline-flex;
      align-items:center;
      justify-content:center;
      background:${bg};
      color:${color};
      border-radius:20px;
      padding:9px 16px;
      font-size:14px;
      font-weight:800;
      font-family:'Plus Jakarta Sans',sans-serif;
      white-space:nowrap;
      box-shadow:${shadow};
      border:none;
      transform:${scale};
      transform-origin:center center;
      transition:transform 0.15s ease, box-shadow 0.15s ease;
      cursor:pointer;
      letter-spacing:-0.2px;
      line-height:1;
    ">${formatted}</div>`,
    iconSize: [90, 36],
    iconAnchor: [45, 18],
    popupAnchor: [0, -20],
  });
}

// Scatter venues on a rough Mexico City area if no coords
const FALLBACK_COORDS = [
  [19.432608, -99.133209],
  [19.44, -99.14],
  [19.42, -99.12],
  [19.45, -99.16],
  [19.41, -99.15],
  [19.43, -99.11],
  [19.46, -99.13],
  [19.415, -99.145],
];

function FitBounds({ venues }) {
  const map = useMap();
  useEffect(() => {
    if (venues.length === 0) return;
    const coords = venues.map((v, i) => v._coords || FALLBACK_COORDS[i % FALLBACK_COORDS.length]);
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [venues]);
  return null;
}

export default function VenueMap({ venues, activeId, onPinHover }) {
  const venuesToShow = venues.map((v, i) => ({
    ...v,
    _coords: FALLBACK_COORDS[i % FALLBACK_COORDS.length],
  }));

  return (
    <MapContainer
      center={[19.432608, -99.133209]}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds venues={venuesToShow} />
      {venuesToShow.map((venue) => (
        <Marker
          key={venue.id}
          position={venue._coords}
          icon={createPriceIcon(venue.price_per_day, activeId === venue.id)}
          eventHandlers={{
            mouseover: () => onPinHover?.(venue.id),
            mouseout: () => onPinHover?.(null),
            click: () => window.open(`/venue/${venue.id}`, "_blank"),
          }}
        />
      ))}
    </MapContainer>
  );
}