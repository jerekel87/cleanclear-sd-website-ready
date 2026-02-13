import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Calendar,
  Briefcase,
  FileText,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  services: string[];
  status: string;
  created_at: string;
  city: string;
  street_address: string;
  zip_code: string;
  latitude: number | null;
  longitude: number | null;
  preferred_timeframe: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  wonLeads: number;
  thisWeekLeads: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: '#0ea5e9',
  contacted: '#f59e0b',
  quoted: '#3b82f6',
  won: '#22c55e',
  lost: '#64748b',
};

const TIMEFRAME_LABELS: Record<string, string> = {
  asap: 'ASAP',
  'this-week': 'This Week',
  'next-week': 'Next Week',
  'this-month': 'This Month',
  flexible: 'Flexible',
};

const SAN_DIEGO_CENTER: [number, number] = [32.7157, -117.1611];

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
  '91901': [32.7095, -116.9028],
  '91902': [32.6495, -117.0328],
  '91910': [32.6395, -117.0428],
  '91911': [32.6095, -117.0528],
  '91913': [32.6295, -116.9828],
  '91914': [32.6695, -116.9228],
  '91915': [32.6195, -116.9328],
  '91941': [32.7595, -116.9928],
  '91942': [32.7795, -116.9628],
  '91945': [32.7395, -117.0128],
  '91950': [32.6795, -117.0828],
  '92019': [32.7895, -116.8828],
  '92020': [32.7895, -116.9328],
  '92021': [32.8195, -116.9128],
  '92025': [33.0795, -117.0428],
  '92027': [33.1195, -117.0228],
  '92028': [33.3195, -117.1528],
  '92029': [33.1395, -117.0328],
  '92064': [32.9695, -117.0328],
  '92065': [33.0495, -116.8928],
  '92067': [33.0095, -117.2228],
  '92069': [33.1495, -117.1428],
  '92071': [32.8495, -116.9528],
  '92075': [32.9595, -117.2628],
  '92078': [33.1295, -117.1628],
  '92081': [33.1995, -117.2328],
  '92083': [33.1895, -117.1828],
  '92084': [33.2295, -117.1328],
  '92091': [32.9695, -117.2428],
  '92096': [33.1495, -117.0628],
};

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    wonLeads: 0,
    thisWeekLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setStats({
        totalLeads: data.length,
        newLeads: data.filter((l) => l.status === 'new').length,
        contactedLeads: data.filter((l) => l.status === 'contacted').length,
        wonLeads: data.filter((l) => l.status === 'won').length,
        thisWeekLeads: data.filter((l) => new Date(l.created_at) >= oneWeekAgo).length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!mapRef.current || loading || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView(SAN_DIEGO_CENTER, 10);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading]);

  useEffect(() => {
    if (!mapInstanceRef.current || leads.length === 0) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    leads.forEach((lead) => {
      let lat = lead.latitude;
      let lng = lead.longitude;

      if (!lat || !lng) {
        const coords = SD_AREA_COORDS[lead.zip_code];
        if (coords) {
          lat = coords[0] + (Math.random() - 0.5) * 0.02;
          lng = coords[1] + (Math.random() - 0.5) * 0.02;
        }
      }

      if (lat && lng) {
        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: STATUS_COLORS[lead.status] || '#0ea5e9',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(mapInstanceRef.current!);

        marker.bindTooltip(
          `<div class="font-semibold">${lead.first_name} ${lead.last_name}</div>
           <div class="text-xs text-gray-500">${lead.services.slice(0, 2).join(', ')}</div>`,
          {
            direction: 'top',
            offset: [0, -8],
          }
        );

        marker.on('click', () => {
          navigate(`/admin/leads/${lead.id}`);
        });
      }
    });
  }, [leads, navigate]);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const recentLeads = leads.slice(0, 6);
  const upcomingAppointments = leads
    .filter((l) => l.status !== 'lost' && l.status !== 'won')
    .slice(0, 4);

  const serviceBreakdown = leads.reduce<Record<string, number>>((acc, lead) => {
    lead.services.forEach((service) => {
      acc[service] = (acc[service] || 0) + 1;
    });
    return acc;
  }, {});

  const topServices = Object.entries(serviceBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your business activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
        <StatCard
          icon={FileText}
          label="Total Leads"
          value={stats.totalLeads}
          iconColor="text-slate-500"
        />
        <StatCard
          icon={Clock}
          label="New Leads"
          value={stats.newLeads}
          iconColor="text-sky-500"
        />
        <StatCard
          icon={CheckCircle}
          label="Won"
          value={stats.wonLeads}
          iconColor="text-green-500"
        />
        <StatCard
          icon={TrendingUp}
          label="In Progress"
          value={stats.contactedLeads}
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Recent Leads</h2>
            </div>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No leads yet</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                  className="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lead.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-block px-2 py-0.5 text-xs font-medium capitalize"
                      style={{
                        backgroundColor: `${STATUS_COLORS[lead.status]}15`,
                        color: STATUS_COLORS[lead.status],
                      }}
                    >
                      {lead.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(lead.created_at)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Service Requests</h2>
            </div>
          </div>
          <div className="p-5">
            {topServices.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No service data</p>
            ) : (
              <div className="space-y-4">
                {topServices.map(([service, count], idx) => {
                  const percentage = Math.round((count / leads.length) * 100);
                  return (
                    <div key={service}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-slate-700">{service}</span>
                        <span className="text-slate-900 font-semibold">{count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: idx === 0 ? '#0ea5e9' : '#e2e8f0',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Lead Locations</h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-sky-500" />
                <span className="text-slate-500">New</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-amber-500" />
                <span className="text-slate-500">Contacted</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500" />
                <span className="text-slate-500">Won</span>
              </span>
            </div>
          </div>
          <div ref={mapRef} className="h-[300px] w-full" />
        </div>

        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <h2 className="font-semibold text-slate-900">Upcoming Follow-ups</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Leads requiring attention</p>
          </div>
          <div className="divide-y divide-slate-200">
            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No pending follow-ups</p>
              </div>
            ) : (
              upcomingAppointments.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                  className="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {TIMEFRAME_LABELS[lead.preferred_timeframe] || 'No preference'}
                        {lead.city && ` - ${lead.city}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  iconColor: string;
}) {
  return (
    <div className="bg-white px-5 py-6 flex items-center gap-4">
      <div className="w-11 h-11 bg-slate-100 flex items-center justify-center">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
