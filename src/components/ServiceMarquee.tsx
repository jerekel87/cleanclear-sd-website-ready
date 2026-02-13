const services: string[] = [
  'Solar Panel Cleaning',
  'Window Cleaning',
  'Power Washing',
  'Roof Washing',
  'Fleet & Vehicle Washing',
  'House Exterior Washing',
  'Driveway & Patio Cleaning',
  'Gutter Cleaning',
  'Commercial Cleaning',
];

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center">
      {services.map((service, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="text-white font-extrabold text-base sm:text-lg lg:text-xl tracking-wide px-3 sm:px-4 uppercase">
            {service}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
        </span>
      ))}
    </div>
  );
}

export default function ServiceMarquee() {
  return (
    <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 py-[19px] overflow-hidden border-b border-sky-400/20">
      <div className="flex animate-marquee">
        <MarqueeTrack />
        <MarqueeTrack />
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
    </div>
  );
}
