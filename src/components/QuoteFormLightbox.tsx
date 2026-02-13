import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useQuoteForm } from '../contexts/QuoteFormContext';
import QuoteForm from './quote-form/QuoteForm';

export default function QuoteFormLightbox() {
  const { open, closeForm } = useQuoteForm();

  useEffect(() => {
    const overflow = open ? 'hidden' : '';
    document.body.style.overflow = overflow;
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeForm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeForm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={closeForm}
      />
      <div className="relative w-full max-w-lg max-h-[80dvh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden animate-slide-up rounded-2xl">
        <button
          onClick={closeForm}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>
        <QuoteForm compact onSuccess={closeForm} />
      </div>
    </div>
  );
}
