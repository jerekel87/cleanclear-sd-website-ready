import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Service Areas', href: '#locations' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const serviceLinks = [
  'Solar Panel Cleaning',
  'Window Cleaning',
  'Power Washing',
  'Roof Washing',
  'Fleet & Vehicle Washing',
  'House Exterior Washing',
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <img
              src="/cleanclear-sd-white.png"
              alt="Clean Clear SD"
              className="h-10 sm:h-12 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              North San Diego County's trusted exterior cleaning specialists.
              Solar, window, power washing, and more.
            </p>
            <p className="text-gray-500 text-xs">
              License #B2025006275
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 transition-colors rounded-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 transition-colors rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 sm:mb-5">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white active:text-sky-300 transition-colors text-sm py-0.5 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 sm:mb-5">Services</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white active:text-sky-300 transition-colors text-sm py-0.5 inline-block"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 sm:mb-5">Contact Us</h4>
            <div className="space-y-3.5 sm:space-y-4">
              <a
                href="tel:+18585684950"
                className="flex items-center gap-3 text-gray-400 hover:text-white active:text-sky-300 transition-colors text-sm py-0.5"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                (858) 568-4950
              </a>
              <a
                href="mailto:jason@cleanclearsd.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white active:text-sky-300 transition-colors text-sm py-0.5"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                jason@cleanclearsd.com
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Serving North San Diego County, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-site mx-auto px-5 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-500 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Clean Clear SD. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs sm:text-sm text-gray-500">
            <a href="#" className="hover:text-white active:text-sky-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white active:text-sky-300 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
