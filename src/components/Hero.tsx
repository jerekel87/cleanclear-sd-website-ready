import { Star, Phone, ChevronRight, ShieldCheck, Clock, Leaf, MapPin } from 'lucide-react';
import HeroLeadForm from './HeroLeadForm';
import ServiceMarquee from './ServiceMarquee';
import { useQuoteForm } from '../contexts/QuoteFormContext';
import { useTypewriter } from '../hooks/useTypewriter';

const rotatingServices = [
  'Exterior Cleaning',
  'Solar Panel Cleaning',
  'Window Cleaning',
  'Power Washing',
  'Roof Washing',
  'Gutter Cleaning',
];

const trustBadges = [
  { icon: Clock, label: '20+ Years Experience' },
  { icon: ShieldCheck, label: 'Licensed & Insured' },
  { icon: Leaf, label: 'Eco-Friendly' },
];

export default function Hero() {
  const { openForm } = useQuoteForm();
  const { displayText } = useTypewriter(rotatingServices);

  return (
    <section id="home" className="relative flex flex-col overflow-hidden">
      <div className="relative flex-1 flex items-center min-h-[100svh]">
        <div className="absolute inset-0">
          <img
            src="/thenewimage.jpg"
            alt="Clean & Clear SD pressure washing"
            className="w-full h-full object-cover object-[10%_20%] sm:object-center"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#03153f]/80 via-[#03153f]/70 to-[#03153f]/90 sm:hidden" />
          <div className="absolute inset-0 hidden sm:block bg-gradient-to-b from-[#03153f]/70 via-[#03153f]/50 to-[#03153f]/80" />
        </div>

        <div className="absolute inset-0 opacity-[0.03] hidden sm:block" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />

        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/8 rounded-full blur-3xl animate-hero-glow hidden sm:block" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-400/6 rounded-full blur-3xl animate-hero-glow-delayed hidden sm:block" />

        <div className="relative max-w-site mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-24 sm:pt-40 sm:pb-28 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-7 flex flex-col">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/10 backdrop-blur-sm border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit animate-fade-in-up">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="w-px h-3.5 sm:h-4 bg-white/20" />
                <span className="text-white/90 text-[11px] sm:text-xs font-semibold tracking-wide">5.0 on Google Reviews</span>
              </div>

              <h1 className="mt-6 sm:mt-10 text-[2.5rem] leading-[1.25] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-white sm:!leading-[1.25] tracking-tight animate-fade-in-up animation-delay-100">
                San Diego's Premier
                <br />
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                    {displayText}
                  </span>
                  <span
                    className="inline-block w-[3px] h-[0.85em] bg-gradient-to-b from-sky-400 to-cyan-300 ml-0.5 align-baseline rounded-full animate-blink"
                  />
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 to-cyan-300 rounded-full opacity-60" />
                </span>
                <br />
                Professionals
              </h1>

              <p className="mt-4 sm:mt-7 text-[15px] sm:text-lg text-gray-300/90 leading-relaxed max-w-lg animate-fade-in-up animation-delay-200">
                From solar panels to rooftops, we deliver spotless results with
                eco-friendly methods. Trusted by over 1,000 San Diego homeowners
                and businesses.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mt-7 sm:mt-9 animate-fade-in-up animation-delay-300">
                <button
                  onClick={openForm}
                  className="lg:hidden group inline-flex items-center justify-center gap-2.5 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all duration-300 text-[15px] sm:text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30 hover:shadow-xl"
                >
                  Get a Free Quote
                  <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
                <a
                  href="#locations"
                  className="hidden sm:inline-flex group items-center justify-center gap-2.5 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 text-base shadow-lg shadow-sky-500/25 hover:shadow-sky-400/30 hover:shadow-xl"
                >
                  <MapPin className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  Servicing Area
                </a>
                <a
                  href="tel:+18585684950"
                  className="group inline-flex items-center justify-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/15 hover:border-white/30 hover:bg-white/10 active:bg-white/15 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all duration-300 text-[15px] sm:text-base"
                >
                  <Phone className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  (858) 568-4950
                </a>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2.5 sm:gap-y-3 animate-fade-in-up animation-delay-400">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-white">
                    <badge.icon className="w-4 h-4 text-sky-400/70" />
                    <span className="text-xs sm:text-sm font-semibold">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex lg:col-span-5 animate-fade-in-up animation-delay-200">
              <div className="w-full relative">
                <div className="absolute -inset-1 bg-gradient-to-b from-sky-400/20 via-sky-500/10 to-transparent rounded-2xl blur-sm" />
                <div className="relative">
                  <HeroLeadForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <ServiceMarquee />
        </div>
      </div>
    </section>
  );
}
