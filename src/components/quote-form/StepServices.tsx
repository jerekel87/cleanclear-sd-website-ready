import { Sun, Sparkles, Droplets, Home, Truck, Building2, Wrench, MoreHorizontal, Check } from 'lucide-react';
import { QuoteFormData, SERVICE_OPTIONS } from './types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun, Sparkles, Droplets, Home, Truck, Building2, Wrench, MoreHorizontal,
};

interface StepServicesProps {
  data: QuoteFormData;
  onChange: (data: Partial<QuoteFormData>) => void;
}

export default function StepServices(props: StepServicesProps) {
  const { data, onChange } = props;
  const toggleService = (id: string) => {
    const current = data.services;
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    onChange({ services: updated });
  };

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-extrabold text-navy-900 mb-1.5">
        What can we help you with?
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Select all the services you're interested in.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SERVICE_OPTIONS.map((service) => {
          const Icon = iconMap[service.icon];
          const selected = data.services.includes(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggleService(service.id)}
              className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
                selected
                  ? 'border-sky-500 bg-sky-50/60 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                  selected ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`font-semibold text-sm transition-colors duration-200 ${
                  selected ? 'text-sky-700' : 'text-navy-900'
                }`}
              >
                {service.label}
              </span>
              {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
