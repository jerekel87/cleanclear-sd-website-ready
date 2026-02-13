import { useState, useRef } from 'react';
import {
  Sun,
  Sparkles,
  Droplets,
  Home,
  Truck,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useQuoteForm } from '../contexts/QuoteFormContext';

const services = [
  {
    icon: Sun,
    title: 'Solar Panel Cleaning',
    description: 'Keep your panels free of dust, pollen, and debris so they generate maximum power year-round.',
    tag: 'Energy',
    image: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Sparkles,
    title: 'Window Cleaning',
    description: 'Crystal-clear windows inside and out, using professional-grade squeegees and eco-friendly solutions.',
    tag: 'Residential',
    image: 'https://images.pexels.com/photos/713297/pexels-photo-713297.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Droplets,
    title: 'Power Washing',
    description: 'From driveways and patios to commercial surfaces, we use the right pressure and techniques to restore safely and effectively.',
    tag: 'Exterior',
    image: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Home,
    title: 'Roof Washing',
    description: 'Low-pressure soft washing to remove algae, moss, and stains while extending your roof\'s lifespan.',
    tag: 'Specialty',
    image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Truck,
    title: 'Fleet & Vehicle Washing',
    description: 'Professional cleaning for RVs, delivery trucks, and commercial fleets to keep your vehicles looking sharp.',
    tag: 'Commercial',
    image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Building2,
    title: 'House Exterior Washing',
    description: 'Keep your property looking fresh, clean, and welcoming year-round with our home exterior care services.',
    tag: 'Residential',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openForm } = useQuoteForm();

  const scrollMobile = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth ?? 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth - 16 : cardWidth + 16,
      behavior: 'smooth',
    });
  };

  return (
    <section id="services" className="py-16 sm:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto mb-10 sm:mb-20">
          <span className="inline-block text-sky-600 font-bold text-xs tracking-widest uppercase mb-3 sm:mb-4">
            Our Services
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-[2.75rem] font-extrabold text-navy-900 !leading-[1.3] mb-4 sm:mb-6">
            Professional Exterior Cleaning Services
          </h2>
          <p className="text-gray-600 text-[15px] sm:text-lg leading-[1.75]">
            From solar panels and windows to roofs and entire buildings, our expert
            team ensures every property looks spotless and well-maintained.
          </p>
        </div>

        <div className="hidden lg:grid grid-cols-12 gap-10 min-h-[540px]">
          <div className="col-span-7 relative rounded-2xl overflow-hidden shadow-lg">
            {services.map((service, idx) => (
              <img
                key={service.title}
                src={service.image}
                alt={service.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  idx === active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <span className="inline-block px-3 py-1 bg-sky-500/90 text-white text-xs font-bold uppercase tracking-wide rounded mb-3">
                {services[active].tag}
              </span>
              <h3 className="text-2xl font-extrabold text-white mb-3">
                {services[active].title}
              </h3>
              <p className="text-white/80 leading-[1.7] max-w-md text-[0.938rem]">
                {services[active].description}
              </p>
            </div>
          </div>

          <div className="col-span-5 flex flex-col gap-3">
            {services.map((service, idx) => (
              <button
                key={service.title}
                onClick={() => setActive(idx)}
                className={`group flex items-center gap-4 w-full text-left rounded-xl transition-all duration-200 ${
                  idx === active
                    ? 'bg-navy-900 px-5 py-5'
                    : 'bg-white hover:bg-gray-50 px-5 py-5 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    idx === active
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-sky-600 group-hover:bg-gray-200'
                  }`}
                >
                  <service.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-bold text-base transition-colors duration-200 ${
                      idx === active ? 'text-white' : 'text-navy-900'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 transition-colors duration-200 line-clamp-1 leading-normal ${
                      idx === active ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {service.description}
                  </p>
                </div>
                <ArrowRight
                  className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                    idx === active
                      ? 'text-sky-400 translate-x-0 opacity-100'
                      : 'text-gray-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center justify-end gap-2 mb-4 sm:hidden">
            <button
              onClick={() => scrollMobile('left')}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollMobile('right')}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex sm:grid sm:grid-cols-2 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth -mx-5 px-5 scroll-pl-5 sm:mx-0 sm:px-0 sm:scroll-px-0 pb-2 sm:pb-0 no-scrollbar"
          >
            {services.map((service) => (
              <div
                key={service.title}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] sm:aspect-[4/3] shadow-md flex-shrink-0 w-[75vw] sm:w-auto snap-start"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="p-1.5 rounded-md bg-sky-500/90 text-white">
                      <service.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-1.5">{service.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10 sm:mt-20">
          <p className="text-navy-900 font-bold text-[15px] sm:text-lg mb-4 sm:mb-5">
            Need something specific? We'll tailor a plan for you.
          </p>
          <button
            onClick={openForm}
            className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 active:bg-navy-950 text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base"
          >
            Request a Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
}
