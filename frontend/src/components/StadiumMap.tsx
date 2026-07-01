import type { MapPin } from "@/types";

interface StadiumMapProps {
  pins: MapPin[];
  singlePin?: { lat: number; lng: number; name: string };
}

function osmUrl(lat: number, lng: number, zoom: number): string {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
}

function osmMultiUrl(pins: MapPin[]): string {
  if (pins.length === 0) return "https://www.openstreetmap.org/export/embed.html";
  const lats = pins.map((p) => p.latitude);
  const lngs = pins.map((p) => p.longitude);
  const minLat = Math.min(...lats) - 2;
  const maxLat = Math.max(...lats) + 2;
  const minLng = Math.min(...lngs) - 2;
  const maxLng = Math.max(...lngs) + 2;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng},${minLat},${maxLng},${maxLat}&layer=mapnik`;
}

export function StadiumMap({ pins, singlePin }: StadiumMapProps) {
  const src = singlePin
    ? osmUrl(singlePin.lat, singlePin.lng, 15)
    : osmMultiUrl(pins);

  const linkHref = singlePin
    ? `https://www.openstreetmap.org/?mlat=${singlePin.lat}&mlon=${singlePin.lng}#map=15/${singlePin.lat}/${singlePin.lng}`
    : "https://www.openstreetmap.org";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <iframe
        src={src}
        className="h-64 w-full"
        title={singlePin ? `Mapa de ${singlePin.name}` : "Mapa de estadios visitados"}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="bg-white px-3 py-1.5 text-right">
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-green-700"
        >
          Ver en OpenStreetMap ↗
        </a>
      </div>
    </div>
  );
}
