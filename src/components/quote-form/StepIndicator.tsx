import { Check } from 'lucide-react';
import { STEP_TITLES } from './types';

interface StepIndicatorProps {
  currentStep: number;
  compact?: boolean;
}

export default function StepIndicator(props: StepIndicatorProps) {
  const { currentStep, compact } = props;
  if (compact) {
    return (
      <div className="flex items-center gap-2 mb-6">
        {STEP_TITLES.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              idx < currentStep
                ? 'bg-green-500'
                : idx === currentStep
                ? 'bg-sky-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-8">
      {STEP_TITLES.map((title, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        return (
          <div key={idx} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-sky-500 text-white ring-4 ring-sky-500/20'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`hidden sm:block text-xs font-semibold mt-2 whitespace-nowrap transition-colors duration-300 ${
                  isCompleted
                    ? 'text-green-600'
                    : isCurrent
                    ? 'text-sky-600'
                    : 'text-gray-400'
                }`}
              >
                {title}
              </span>
            </div>
            {idx < STEP_TITLES.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded transition-colors duration-500 ${
                  idx < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
