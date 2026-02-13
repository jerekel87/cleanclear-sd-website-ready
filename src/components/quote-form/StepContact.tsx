import { QuoteFormData } from './types';

interface StepContactProps {
  data: QuoteFormData;
  onChange: (data: Partial<QuoteFormData>) => void;
}

const inputClasses =
  'w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white outline-none transition-all text-sm';

export default function StepContact(props: StepContactProps) {
  const { data, onChange } = props;
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-extrabold text-navy-900 mb-1.5">
        Your contact details
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        We'll use this to reach out with your quote.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">
              First Name <span className="text-sky-500">*</span>
            </label>
            <input
              type="text"
              required
              value={data.first_name}
              onChange={(e) => onChange({ first_name: e.target.value })}
              placeholder="John"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">
              Last Name <span className="text-sky-500">*</span>
            </label>
            <input
              type="text"
              required
              value={data.last_name}
              onChange={(e) => onChange({ last_name: e.target.value })}
              placeholder="Smith"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">
              Phone <span className="text-sky-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="(858) 555-0000"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1.5">
              Email <span className="text-sky-500">*</span>
            </label>
            <input
              type="email"
              required
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="john@example.com"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm font-semibold text-navy-900 mb-3">
            Service Address <span className="text-gray-400 font-normal">(optional)</span>
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={data.street_address}
              onChange={(e) => onChange({ street_address: e.target.value })}
              placeholder="Street address"
              className={inputClasses}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={data.city}
                onChange={(e) => onChange({ city: e.target.value })}
                placeholder="City"
                className={inputClasses}
              />
              <input
                type="text"
                value={data.zip_code}
                onChange={(e) => onChange({ zip_code: e.target.value })}
                placeholder="Zip code"
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
