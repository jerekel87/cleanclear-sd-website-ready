import { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, CheckCircle, Shield, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { QuoteFormData, INITIAL_FORM_DATA, SERVICE_OPTIONS, STEP_TITLES } from './types';
import StepIndicator from './StepIndicator';
import StepServices from './StepServices';
import StepProperty from './StepProperty';
import StepContact from './StepContact';
import StepSchedule from './StepSchedule';

interface QuoteFormProps {
  compact?: boolean;
  onSuccess?: () => void;
}

export default function QuoteForm(props: QuoteFormProps) {
  const { compact, onSuccess } = props;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuoteFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [validationError, setValidationError] = useState('');

  const totalSteps = STEP_TITLES.length;

  const updateData = (partial: Partial<QuoteFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setValidationError('');
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 0:
        if (data.services.length === 0) {
          setValidationError('Please select at least one service.');
          return false;
        }
        return true;
      case 1:
        return true;
      case 2:
        if (!data.first_name.trim()) {
          setValidationError('First name is required.');
          return false;
        }
        if (!data.last_name.trim()) {
          setValidationError('Last name is required.');
          return false;
        }
        if (!data.phone.trim()) {
          setValidationError('Phone number is required.');
          return false;
        }
        if (!data.email.trim()) {
          setValidationError('Email address is required.');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          setValidationError('Please enter a valid email address.');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
    setValidationError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setStatus('sending');

    const serviceLabels = data.services.map(
      (id) => SERVICE_OPTIONS.find((s) => s.id === id)?.label ?? id
    );

    const { error } = await supabase.from('leads').insert([{
      services: serviceLabels,
      property_type: data.property_type,
      stories: data.stories,
      square_footage: data.square_footage,
      solar_panel_count: data.solar_panel_count,
      property_notes: data.property_notes,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      street_address: data.street_address,
      city: data.city,
      zip_code: data.zip_code,
      preferred_timeframe: data.preferred_timeframe,
      preferred_time: data.preferred_time,
      notes: data.notes,
    }]);

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('sent');
    onSuccess?.();
  };

  const reset = () => {
    setData(INITIAL_FORM_DATA);
    setStep(0);
    setStatus('idle');
    setValidationError('');
  };

  if (status === 'sent') {
    return (
      <div className={`bg-white ${compact ? 'rounded-2xl shadow-2xl shadow-black/10 p-6 lg:p-8' : 'rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-10'}`}>
        <div className="text-center py-6 sm:py-10">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 mb-2">
            Quote Request Received!
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto text-sm leading-relaxed">
            We'll review your request and get back to you within 2 hours during business hours with a personalized quote.
          </p>
          <button
            onClick={reset}
            className="text-sky-600 font-bold hover:text-sky-700 transition-colors text-sm"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${compact ? 'rounded-2xl shadow-2xl shadow-black/10 p-5 lg:p-7' : 'rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-8'}`}>
      {compact && (
        <div className="flex items-center gap-2 text-sky-600 mb-3">
          <Zap className="w-5 h-5 fill-sky-100" />
          <span className="text-xs font-bold uppercase tracking-wider">Fast & Free</span>
        </div>
      )}

      {compact ? (
        <>
          <h3 className="text-xl lg:text-2xl font-extrabold text-navy-900 mb-1">Get a Free Quote</h3>
          <p className="text-gray-500 text-xs mb-4">Step {step + 1} of {totalSteps}</p>
          <StepIndicator currentStep={step} compact />
        </>
      ) : (
        <StepIndicator currentStep={step} />
      )}

      <div className="min-h-[320px]">
        {step === 0 && <StepServices data={data} onChange={updateData} />}
        {step === 1 && <StepProperty data={data} onChange={updateData} />}
        {step === 2 && <StepContact data={data} onChange={updateData} />}
        {step === 3 && <StepSchedule data={data} onChange={updateData} />}
      </div>

      {validationError && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <p className="text-red-700 text-sm font-medium">{validationError}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <p className="text-red-700 text-sm font-medium">
            Something went wrong. Please try again or call us at (858) 568-4950.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
        {step > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center gap-1.5 text-gray-600 hover:text-navy-900 font-semibold text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm shadow-sky-500/20 hover:shadow-md"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === 'sending'}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-md"
          >
            {status === 'sending' ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>
        )}
      </div>

      {compact && (
        <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-4">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-xs">No spam. Your info stays private.</span>
        </div>
      )}
    </div>
  );
}
