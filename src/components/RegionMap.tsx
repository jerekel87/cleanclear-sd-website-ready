import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionMapProps {
  center: [number, number];
  zoom: number;
  label: string;
}

export default function RegionMap(props: RegionMapProps) {
  const { center, zoom, label } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false,
        touchZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);
      initializedRef.current = true;
    } else {
      mapRef.current.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label={`Map of ${label} service area`}
      className="absolute inset-0 w-full h-full z-0"
    />
  );
}
