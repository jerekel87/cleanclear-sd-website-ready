import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Phone, MessageSquare, ChevronDown, ChevronRight, Sun, Sparkles, Droplets, Home, Truck, Building2 } from 'lucide-react';
import { useQuoteForm } from '../contexts/QuoteFormContext';

const services = [
  { icon: Sun, title: 'Solar Panel Cleaning', href: '#services' },
  { icon: Sparkles, title: 'Window Cleaning', href: '#services' },
  { icon: Droplets, title: 'Power Washing', href: '#services' },
  { icon: Home, title: 'Roof Washing', href: '#services' },
  { icon: Truck, title: 'Fleet & Vehicle Washing', href: '#services' },
  { icon: Building2, title: 'House Exterior Washing', href: '#services' },
];

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services', hasDropdown: true },
  { label: 'Areas', href: '#locations' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#testimonials' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openForm } = useQuoteForm();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const sections = navLinks.map(link => link.href.substring(1));
    const onScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveLink(`#${sections[i]}`);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#home" className="flex-shrink-0 relative z-[60]">
            <img
              src="/cleanclear-sd-blue.png"
              alt="Clean Clear SD"
              className="h-9 sm:h-11 w-auto"
            />
          </a>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    onMouseEnter={() => setServicesOpen(true)}
                    className={`relative px-4 py-2 text-[15px] font-semibold tracking-wide transition-all duration-200 rounded-lg flex items-center gap-1 ${
                      activeLink === link.href
                        ? 'text-navy-900 bg-gray-100'
                        : 'text-navy-800 hover:text-navy-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div
                    onMouseLeave={() => setServicesOpen(false)}
                    className={`absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                      servicesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="p-2">
                      {services.map((service) => (
                        <a
                          key={service.title}
                          href={service.href}
                          onClick={() => {
                            setServicesOpen(false);
                            window.dispatchEvent(new CustomEvent('select-service', { detail: service.title }));
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-100 transition-colors">
                            <service.icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-navy-900 text-sm">{service.title}</span>
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 p-3 bg-gray-50">
                      <a
                        href="#services"
                        onClick={() => setServicesOpen(false)}
                        className="block text-center text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        View All Services
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[15px] font-semibold tracking-wide transition-all duration-200 rounded-lg ${
                    activeLink === link.href
                      ? 'text-navy-900 bg-gray-100'
                      : 'text-navy-800 hover:text-navy-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </a>
              )
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-5">
            <a
              href="tel:+18585684950"
              className="flex items-center gap-2 text-base font-bold transition-colors text-navy-800"
            >
              <Phone className="w-5 h-5" />
              (858) 568-4950
            </a>
            <button
              onClick={openForm}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg text-base font-bold transition-all duration-200 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40"
            >
              <MessageSquare className="w-5 h-5" />
              Free Quote
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`xl:hidden relative z-[60] w-11 h-11 flex items-center justify-center rounded-lg transition-colors ${
              mobileOpen
                ? 'text-white'
                : 'text-navy-800'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`xl:hidden fixed inset-0 z-50 transition-all duration-500 ${
          mobileOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-navy-950 transition-opacity duration-500 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-400 transition-transform duration-700 ease-out origin-left ${
            mobileOpen ? 'scale-x-100' : 'scale-x-0'
          }`}
        />

        <div className="relative h-full flex flex-col pt-20 sm:pt-24 pb-8 overflow-y-auto">
          <nav className="flex-1 flex flex-col items-center justify-center -mt-8">
            {navLinks.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                style={{
                  transitionDelay: mobileOpen ? `${idx * 60 + 150}ms` : '0ms',
                }}
                className={`block py-3 text-2xl sm:text-[1.75rem] font-bold tracking-tight text-center transition-all duration-500 ease-out ${
                  mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                } ${
                  activeLink === link.href
                    ? 'text-white'
                    : 'text-white/40 active:text-white/70'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="px-8 sm:px-12 space-y-3 transition-all duration-500 ease-out"
            style={{
              transitionDelay: mobileOpen ? `${navLinks.length * 60 + 200}ms` : '0ms',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            <a
              href="tel:+18585684950"
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-[15px] text-white border border-white/15 active:bg-white/5 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Us - (858) 568-4950
            </a>
            <button
              onClick={() => { closeMobile(); openForm(); }}
              className="flex items-center justify-center gap-2.5 bg-sky-500 active:bg-sky-600 text-white py-3.5 rounded-xl font-bold text-[15px] transition-colors shadow-lg shadow-sky-500/20 w-full"
            >
              <MessageSquare className="w-5 h-5" />
              Get a Free Quote
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
