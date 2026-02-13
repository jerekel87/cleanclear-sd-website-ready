export interface QuoteFormData {
  services: string[];
  property_type: string;
  stories: string;
  square_footage: string;
  solar_panel_count: string;
  property_notes: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  street_address: string;
  city: string;
  zip_code: string;
  preferred_timeframe: string;
  preferred_time: string;
  notes: string;
}

export const INITIAL_FORM_DATA: QuoteFormData = {
  services: [],
  property_type: '',
  stories: '',
  square_footage: '',
  solar_panel_count: '',
  property_notes: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  street_address: '',
  city: '',
  zip_code: '',
  preferred_timeframe: '',
  preferred_time: '',
  notes: '',
};

export const SERVICE_OPTIONS = [
  { id: 'solar', label: 'Solar Panel Cleaning', icon: 'Sun' },
  { id: 'window', label: 'Window Cleaning', icon: 'Sparkles' },
  { id: 'power-washing', label: 'Power Washing', icon: 'Droplets' },
  { id: 'roof', label: 'Roof Washing', icon: 'Home' },
  { id: 'fleet', label: 'Fleet & Vehicle Washing', icon: 'Truck' },
  { id: 'house-exterior', label: 'House Exterior Washing', icon: 'Building2' },
  { id: 'gutter', label: 'Gutter Cleaning', icon: 'Wrench' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal' },
] as const;

export const PROPERTY_TYPES = ['Residential', 'Commercial'] as const;
export const STORY_OPTIONS = ['1 Story', '2 Stories', '3+ Stories'] as const;
export const SQUARE_FOOTAGE_OPTIONS = [
  'Under 1,000 sq ft',
  '1,000 - 1,999 sq ft',
  '2,000 - 2,999 sq ft',
  '3,000 - 4,999 sq ft',
  '5,000+ sq ft',
] as const;
export const SOLAR_PANEL_OPTIONS = [
  'Up to 12 Panels',
  '13 - 24 Panels',
  '25 - 36 Panels',
  '37 - 48 Panels',
  '49+ Panels',
] as const;

export const TIMEFRAME_OPTIONS = [
  { id: 'asap', label: 'As Soon As Possible' },
  { id: 'this-week', label: 'This Week' },
  { id: 'next-week', label: 'Next Week' },
  { id: 'this-month', label: 'Within the Month' },
  { id: 'flexible', label: 'Flexible / No Rush' },
] as const;

export const TIME_OF_DAY_OPTIONS = [
  { id: 'morning', label: 'Morning (8am - 12pm)' },
  { id: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
  { id: 'no-preference', label: 'No Preference' },
] as const;

export const STEP_TITLES: readonly string[] = [
  'Select Services',
  'Property Details',
  'Contact Information',
  'Schedule & Review',
];
