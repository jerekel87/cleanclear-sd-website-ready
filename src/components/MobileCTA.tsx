import { useState, useEffect } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { useQuoteForm } from '../contexts/QuoteFormContext';

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);
  const { openForm } = useQuoteForm();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 safe-area-bottom">
        <div className="flex gap-3">
          <a
            href="tel:+18585684950"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-900 text-white py-3.5 rounded-xl font-bold text-sm active:bg-navy-800 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
          <button
            onClick={openForm}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-sky-500 text-white py-3.5 rounded-xl font-bold text-sm active:bg-sky-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Free Quote
          </button>
        </div>
      </div>
    </div>
  );
}
