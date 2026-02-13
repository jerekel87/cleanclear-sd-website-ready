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
  lost: '#6b7280',
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

  const recentLeads = leads.slice(0, 5);
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
        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of your business activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={stats.totalLeads}
          trend={`+${stats.thisWeekLeads} this week`}
          color="bg-gray-100"
          iconColor="text-gray-700"
        />
        <StatCard
          icon={Clock}
          label="New Leads"
          value={stats.newLeads}
          trend="Awaiting contact"
          color="bg-sky-50"
          iconColor="text-sky-600"
        />
        <StatCard
          icon={TrendingUp}
          label="In Progress"
          value={stats.contactedLeads}
          trend="Being worked on"
          color="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Won"
          value={stats.wonLeads}
          trend="Converted to jobs"
          color="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">Lead Locations</h2>
              <p className="text-sm text-gray-500 mt-1">Click a marker to view lead details</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span className="text-gray-600">New</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-gray-600">Contacted</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Won</span>
              </span>
            </div>
          </div>
          <div ref={mapRef} className="h-[450px] w-full" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-lg">Recent Leads</h2>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {recentLeads.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No leads yet</p>
              </div>
            ) : (
              recentLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {lead.services.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
                        style={{
                          backgroundColor: `${STATUS_COLORS[lead.status]}15`,
                          color: STATUS_COLORS[lead.status],
                        }}
                      >
                        {lead.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimeAgo(lead.created_at)}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-lg">Service Requests</h2>
            <p className="text-sm text-gray-500 mt-1">Most requested services</p>
          </div>
          <div className="p-6">
            {topServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No service data</p>
            ) : (
              <div className="space-y-5">
                {topServices.map(([service, count], idx) => {
                  const percentage = Math.round((count / leads.length) * 100);
                  return (
                    <div key={service}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{service}</span>
                        <span className="text-gray-500">{count} requests</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: idx === 0 ? '#0ea5e9' : idx === 1 ? '#22c55e' : '#6b7280',
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-lg">Upcoming Follow-ups</h2>
            <p className="text-sm text-gray-500 mt-1">Leads requiring attention</p>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending follow-ups</p>
              </div>
            ) : (
              upcomingAppointments.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => navigate(`/admin/leads/${lead.id}`)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${STATUS_COLORS[lead.status]}15` }}
                    >
                      <Calendar
                        className="w-5 h-5"
                        style={{ color: STATUS_COLORS[lead.status] }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {TIMEFRAME_LABELS[lead.preferred_timeframe] || 'No preference'}
                        </span>
                        {lead.city && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {lead.city}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
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
  trend,
  color,
  iconColor,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  trend: string;
  color: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-4">{trend}</p>
    </div>
  );
}
