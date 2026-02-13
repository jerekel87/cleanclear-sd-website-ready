import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  Home,
  Layers,
  Square,
  Sun,
  CheckCircle,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Lead {
  id: string;
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
  status: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-sky-100 text-sky-700', bgHex: '#e0f2fe', textHex: '#0369a1' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-100 text-amber-700', bgHex: '#fef3c7', textHex: '#b45309' },
  { value: 'quoted', label: 'Quoted', color: 'bg-blue-100 text-blue-700', bgHex: '#dbeafe', textHex: '#1d4ed8' },
  { value: 'won', label: 'Won', color: 'bg-green-100 text-green-700', bgHex: '#dcfce7', textHex: '#15803d' },
  { value: 'lost', label: 'Lost', color: 'bg-gray-100 text-gray-600', bgHex: '#f3f4f6', textHex: '#4b5563' },
] as const;

const TIMEFRAME_LABELS: Record<string, string> = {
  asap: 'ASAP',
  'this-week': 'This Week',
  'next-week': 'Next Week',
  'this-month': 'This Month',
  flexible: 'Flexible',
};

const TIME_LABELS: Record<string, string> = {
  morning: 'Morning (8am - 12pm)',
  afternoon: 'Afternoon (12pm - 5pm)',
  'no-preference': 'No Preference',
};

const SD_AREA_COORDS: Record<string, [number, number]> = {
  '92101': [32.7195, -117.1628],
  '92102': [32.7095, -117.1228],
  '92103': [32.7462, -117.1698],
  '92104': [32.7512, -117.1298],
  '92105': [32.7312, -117.0928],
  '92106': [32.7195, -117.2328],
  '92107': [32.7412, -117.2498],
  '92108': [32.7762, -117.1198],
  '92109': [32.7895, -117.2398],
  '92110': [32.7562, -117.1998],
  '92111': [32.8062, -117.1698],
  '92113': [32.6895, -117.0998],
  '92114': [32.7012, -117.0398],
  '92115': [32.7562, -117.0698],
  '92116': [32.7662, -117.1298],
  '92117': [32.8262, -117.2098],
  '92118': [32.6795, -117.1698],
  '92119': [32.8012, -116.9998],
  '92120': [32.7912, -117.0698],
  '92121': [32.8962, -117.2098],
  '92122': [32.8562, -117.2198],
  '92123': [32.8162, -117.1298],
  '92124': [32.8262, -117.0698],
  '92126': [32.9062, -117.1398],
  '92127': [33.0262, -117.0798],
  '92128': [33.0162, -117.0598],
  '92129': [32.9662, -117.1298],
  '92130': [32.9562, -117.2298],
  '92131': [32.9262, -117.0698],
};

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLead = async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        setLead(data);
      }
      setLoading(false);
    };

    fetchLead();
  }, [id]);

  useEffect(() => {
    if (!mapRef.current || !lead || mapInstanceRef.current) return;

    let lat = lead.latitude;
    let lng = lead.longitude;

    if (!lat || !lng) {
      const coords = SD_AREA_COORDS[lead.zip_code];
      if (coords) {
        lat = coords[0];
        lng = coords[1];
      }
    }

    if (lat && lng) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
      }).setView([lat, lng], 14);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const statusOption = STATUS_OPTIONS.find((s) => s.value === lead.status);
      const markerColor = statusOption?.textHex || '#0ea5e9';

      L.circleMarker([lat, lng], {
        radius: 12,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lead]);

  const updateStatus = async (newStatus: string) => {
    if (!lead || updating) return;

    setUpdating(true);
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', lead.id);

    if (!error) {
      setLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setUpdating(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Lead not found</p>
        <button
          onClick={() => navigate('/admin/leads')}
          className="mt-4 text-sky-600 hover:text-sky-700 font-medium"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === lead.status) || STATUS_OPTIONS[0];
  const hasLocation = lead.latitude && lead.longitude || SD_AREA_COORDS[lead.zip_code];

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {lead.first_name} {lead.last_name}
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(lead.created_at)}
                </p>
              </div>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium ${currentStatus.color}`}
              >
                {currentStatus.label}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center group-hover:border-sky-300 transition-colors">
                  <Phone className="w-5 h-5 text-gray-600 group-hover:text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{lead.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center group-hover:border-sky-300 transition-colors">
                  <Mail className="w-5 h-5 text-gray-600 group-hover:text-sky-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{lead.email}</p>
                </div>
              </a>
            </div>

            {(lead.street_address || lead.city) && (
              <div className="mt-4 p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {[lead.street_address, lead.city, lead.zip_code].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Services Requested</h2>
            <div className="flex flex-wrap gap-2">
              {lead.services.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  {service}
                </span>
              ))}
            </div>
          </div>

          {(lead.property_type || lead.stories || lead.square_footage || lead.solar_panel_count) && (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {lead.property_type && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Property Type</p>
                      <p className="text-sm font-medium text-gray-900">{lead.property_type}</p>
                    </div>
                  </div>
                )}
                {lead.stories && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    <Layers className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Stories</p>
                      <p className="text-sm font-medium text-gray-900">{lead.stories}</p>
                    </div>
                  </div>
                )}
                {lead.square_footage && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    <Square className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Square Footage</p>
                      <p className="text-sm font-medium text-gray-900">{lead.square_footage}</p>
                    </div>
                  </div>
                )}
                {lead.solar_panel_count && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    <Sun className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Solar Panels</p>
                      <p className="text-sm font-medium text-gray-900">{lead.solar_panel_count}</p>
                    </div>
                  </div>
                )}
              </div>
              {lead.property_notes && (
                <div className="mt-4 p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">Property Notes</p>
                  <p className="text-sm text-gray-700">{lead.property_notes}</p>
                </div>
              )}
            </div>
          )}

          {(lead.preferred_timeframe || lead.preferred_time) && (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Scheduling Preference</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {lead.preferred_timeframe && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Preferred Timeframe</p>
                      <p className="text-sm font-medium text-gray-900">
                        {TIMEFRAME_LABELS[lead.preferred_timeframe] || lead.preferred_timeframe}
                      </p>
                    </div>
                  </div>
                )}
                {lead.preferred_time && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Preferred Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {TIME_LABELS[lead.preferred_time] || lead.preferred_time}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {lead.notes && (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Additional Notes</h2>
              <div className="flex items-start gap-3 p-4 bg-gray-50">
                <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">{lead.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Update Status</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => updateStatus(status.value)}
                  disabled={lead.status === status.value || updating}
                  className={`w-full px-4 py-2.5 text-sm font-medium transition-all border flex items-center justify-between ${
                    lead.status === status.value
                      ? `${status.color} border-current`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {status.label}
                  {lead.status === status.value && <CheckCircle className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 font-medium text-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 font-medium text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
            </div>
          </div>

          {hasLocation && (
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Location</h2>
              </div>
              <div ref={mapRef} className="h-[200px] w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
