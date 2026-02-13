import { QuoteFormData, TIMEFRAME_OPTIONS, TIME_OF_DAY_OPTIONS, SERVICE_OPTIONS } from './types';
import { Clock, CalendarDays } from 'lucide-react';

interface StepScheduleProps {
  data: QuoteFormData;
  onChange: (data: Partial<QuoteFormData>) => void;
}

const inputClasses =
  'w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white outline-none transition-all text-sm';

export default function StepSchedule(props: StepScheduleProps) {
  const { data, onChange } = props;
  const selectedServiceLabels = data.services.map(
    (id) => SERVICE_OPTIONS.find((s) => s.id === id)?.label ?? id
  );

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-extrabold text-navy-900 mb-1.5">
        When works best?
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Let us know your preferred timing and we'll do our best to accommodate.
      </p>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 mb-2.5">
            <CalendarDays className="w-4 h-4 text-sky-500" />
            Preferred Timeframe
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TIMEFRAME_OPTIONS.map((opt) => {
              const selected = data.preferred_timeframe === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ preferred_timeframe: opt.id })}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all duration-200 ${
                    selected
                      ? 'border-sky-500 bg-sky-50/60 text-sky-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-navy-900'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-navy-900 mb-2.5">
            <Clock className="w-4 h-4 text-sky-500" />
            Preferred Time of Day
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {TIME_OF_DAY_OPTIONS.map((opt) => {
              const selected = data.preferred_time === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ preferred_time: opt.id })}
                  className={`px-3 py-3 rounded-lg border-2 text-xs sm:text-sm font-medium text-center transition-all duration-200 ${
                    selected
                      ? 'border-sky-500 bg-sky-50/60 text-sky-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-navy-900'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">
            Anything else we should know? <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={data.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Special access instructions, specific concerns, questions..."
            rows={3}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Quote Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Services</span>
              <span className="text-navy-900 font-medium text-right max-w-[60%]">
                {selectedServiceLabels.join(', ') || '--'}
              </span>
            </div>
            {data.property_type && (
              <div className="flex justify-between">
                <span className="text-gray-500">Property</span>
                <span className="text-navy-900 font-medium">
                  {data.property_type}{data.stories ? `, ${data.stories}` : ''}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Contact</span>
              <span className="text-navy-900 font-medium">
                {data.first_name} {data.last_name}
              </span>
            </div>
            {data.preferred_timeframe && (
              <div className="flex justify-between">
                <span className="text-gray-500">Timing</span>
                <span className="text-navy-900 font-medium">
                  {TIMEFRAME_OPTIONS.find((t) => t.id === data.preferred_timeframe)?.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
