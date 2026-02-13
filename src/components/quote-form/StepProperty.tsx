import { Home, Building2 } from 'lucide-react';
import {
  QuoteFormData,
  PROPERTY_TYPES,
  STORY_OPTIONS,
  SQUARE_FOOTAGE_OPTIONS,
  SOLAR_PANEL_OPTIONS,
} from './types';

interface StepPropertyProps {
  data: QuoteFormData;
  onChange: (data: Partial<QuoteFormData>) => void;
}

const inputClasses =
  'w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white outline-none transition-all text-sm';

export default function StepProperty(props: StepPropertyProps) {
  const { data, onChange } = props;
  const hasSolar = data.services.includes('solar');
  const propertyIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Residential: Home,
    Commercial: Building2,
  };

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-extrabold text-navy-900 mb-1.5">
        Tell us about your property
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        This helps us provide a more accurate estimate.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2.5">
            Property Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PROPERTY_TYPES.map((type) => {
              const Icon = propertyIcons[type];
              const selected = data.property_type === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange({ property_type: type })}
                  className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                    selected
                      ? 'border-sky-500 bg-sky-50/60 text-sky-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-navy-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2.5">
            Number of Stories
          </label>
          <div className="grid grid-cols-3 gap-3">
            {STORY_OPTIONS.map((option) => {
              const selected = data.stories === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onChange({ stories: option })}
                  className={`px-3 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                    selected
                      ? 'border-sky-500 bg-sky-50/60 text-sky-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-navy-900'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">
            Approximate Size
          </label>
          <select
            value={data.square_footage}
            onChange={(e) => onChange({ square_footage: e.target.value })}
            className={inputClasses}
          >
            <option value="">Select approximate size</option>
            {SQUARE_FOOTAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {hasSolar && (
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">
              Number of Solar Panels
            </label>
            <select
              value={data.solar_panel_count}
              onChange={(e) => onChange({ solar_panel_count: e.target.value })}
              className={inputClasses}
            >
              <option value="">Select panel count</option>
              {SOLAR_PANEL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">
            Additional Property Details <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={data.property_notes}
            onChange={(e) => onChange({ property_notes: e.target.value })}
            placeholder="e.g., Two-story house with 30 windows, steep roof pitch, gated community..."
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}
