import { useState, useCallback, useMemo } from 'react';
import { MapPin, MessageSquare } from 'lucide-react';
import RegionMap from './RegionMap';
import { useQuoteForm } from '../contexts/QuoteFormContext';
import { useWebsiteContent } from '../hooks/useWebsiteContent';

const LOCATIONS_DEFAULTS = {
  label: 'Service Areas',
  title_part1: 'Proudly Serving',
  title_colored: 'North San Diego County',
  description: 'Clean Clear SD proudly serves homeowners and businesses throughout North San Diego County. From coastal communities to inland neighborhoods, our team brings reliable, high-quality exterior cleaning right to your doorstep.',
};

const regions = [
  {
    name: 'North Coastal',
    center: [33.10, -117.30] as [number, number],
    zoom: 11,
    areas: [
      { name: 'Encinitas', detail: 'Cardiff, Leucadia & more', coords: [33.0369, -117.2919] as [number, number] },
      { name: 'Carlsbad', detail: 'Coastal homes & businesses', coords: [33.1581, -117.3506] as [number, number] },
      { name: 'Oceanside', detail: 'Military & residential', coords: [33.1959, -117.3795] as [number, number] },
      { name: 'Solana Beach', detail: 'Beachfront properties', coords: [32.9912, -117.2712] as [number, number] },
      { name: 'Del Mar', detail: 'Luxury coastal homes', coords: [32.9595, -117.2653] as [number, number] },
      { name: 'La Jolla', detail: 'Coastal community', coords: [32.8328, -117.2713] as [number, number] },
    ],
  },
  {
    name: 'North Inland',
    center: [33.15, -117.08] as [number, number],
    zoom: 11,
    areas: [
      { name: 'Escondido', detail: 'Inland communities', coords: [33.1192, -117.0864] as [number, number] },
      { name: 'San Marcos', detail: 'Residential & commercial', coords: [33.1434, -117.1661] as [number, number] },
      { name: 'Vista', detail: 'North County neighborhoods', coords: [33.2000, -117.2426] as [number, number] },
      { name: 'Poway', detail: 'Family neighborhoods', coords: [32.9628, -117.0359] as [number, number] },
      { name: 'Rancho Bernardo', detail: 'Planned communities', coords: [33.0174, -117.0766] as [number, number] },
      { name: 'Fallbrook', detail: 'Rural & residential', coords: [33.3764, -117.2511] as [number, number] },
    ],
  },
  {
    name: 'Greater SD',
    center: [32.95, -117.15] as [number, number],
    zoom: 10,
    areas: [
      { name: 'Rancho Santa Fe', detail: 'Luxury estates', coords: [33.0164, -117.2025] as [number, number] },
      { name: 'Valley Center', detail: 'Rural properties', coords: [33.2182, -117.0342] as [number, number] },
      { name: 'Bonsall', detail: 'Country homes', coords: [33.2889, -117.2251] as [number, number] },
      { name: 'Ramona', detail: 'East County residential', coords: [33.0417, -116.8689] as [number, number] },
      { name: 'Scripps Ranch', detail: 'Family communities', coords: [32.8972, -117.1017] as [number, number] },
    ],
  },
];

export default function Locations() {
  const { openForm } = useQuoteForm();
  const { content } = useWebsiteContent('locations', LOCATIONS_DEFAULTS);
  const [activeRegion, setActiveRegion] = useState(0);
  const [activeArea, setActiveArea] = useState<number | null>(null);

  const handleRegionChange = useCallback((idx: number) => {
    setActiveRegion(idx);
    setActiveArea(null);
  }, []);

  const handleAreaClick = useCallback((idx: number) => {
    setActiveArea((prev) => (prev === idx ? null : idx));
  }, []);

  const region = useMemo(() => regions[activeRegion], [activeRegion]);

  const mapCenter = useMemo(() => {
    if (activeArea !== null) return region.areas[activeArea].coords;
    return region.center;
  }, [activeArea, region]);

  const mapZoom = useMemo(() => {
    if (activeArea !== null) return 14;
    return region.zoom;
  }, [activeArea, region]);

  return (
    <section id="locations" className="relative z-0 py-16 sm:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-sky-600 font-bold text-xs tracking-widest uppercase mb-3 sm:mb-4">
              {content.label}
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-[2.75rem] font-extrabold text-navy-900 !leading-[1.3] mb-5 sm:mb-8">
              {content.title_part1}{' '}
              <span className="text-sky-600">{content.title_colored}</span>
            </h2>

            <p className="text-gray-600 text-[15px] sm:text-lg leading-[1.75] max-w-xl mb-6 sm:mb-10">
              {content.description}
            </p>

            <div className="flex bg-gray-100 rounded-xl p-1.5 mb-6 sm:mb-8">
              {regions.map((r, idx) => (
                <button
                  key={r.name}
                  onClick={() => handleRegionChange(idx)}
                  className={`flex-1 py-2.5 sm:py-3.5 text-[13px] sm:text-[15px] font-bold rounded-lg sm:rounded-[10px] transition-all duration-200 ${
                    idx === activeRegion
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-gray-600 hover:text-navy-900 hover:bg-gray-200/60 active:bg-gray-200'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mb-4 sm:mb-6">
              {region.areas.map((area, idx) => (
                <button
                  key={area.name}
                  onClick={() => handleAreaClick(idx)}
                  className={`group flex items-center gap-2.5 sm:gap-3.5 px-3 sm:px-5 py-3.5 sm:py-5 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                    activeArea === idx
                      ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-200'
                      : 'bg-gray-50 hover:bg-sky-50 border-gray-100 hover:border-sky-200 active:bg-sky-50'
                  }`}
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors ${
                    activeArea === idx
                      ? 'bg-sky-500 border-sky-500'
                      : 'bg-white border-gray-100 group-hover:border-sky-200'
                  }`}>
                    <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeArea === idx ? 'text-white' : 'text-sky-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-navy-900 text-sm sm:text-base leading-snug truncate">{area.name}</div>
                    <div className="text-[11px] sm:text-sm text-gray-500 mt-0.5 leading-normal truncate">{area.detail}</div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-gray-500">
              Don't see your area? Give us a call {'\u2014'} we likely cover it.
            </p>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <div className="relative w-full aspect-[4/3] lg:aspect-[4/5] bg-slate-200">
                <RegionMap
                  center={mapCenter}
                  zoom={mapZoom}
                  label={activeArea !== null ? region.areas[activeArea].name : region.name}
                />
              </div>

            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16">
          <button
            onClick={openForm}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
          >
            <MessageSquare className="w-5 h-5" />
            Get a Free Quote for Your Area
          </button>
        </div>
      </div>
    </section>
  );
}
