import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Home,
  Layers,
  Square,
  Sun,
  Tag,
  Calendar,
  Clock,
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
  PlayCircle,
  MessageSquare,
} from 'lucide-react';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  zip_code: string;
  property_type: string;
  stories: string;
  square_footage: string;
  solar_panel_count: string;
  tags: string[];
  notes: string;
  source: string;
  lead_id: string | null;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  services: string[];
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number;
  price: number | null;
  notes: string;
  created_at: string;
}

const JOB_STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Calendar },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-700', icon: PlayCircle },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-600', icon: XCircle },
};

const TAG_COLORS: Record<string, string> = {
  residential: 'bg-sky-100 text-sky-700',
  commercial: 'bg-amber-100 text-amber-700',
  hoa: 'bg-green-100 text-green-700',
  'property manager': 'bg-blue-100 text-blue-700',
};

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const [customerRes, jobsRes] = await Promise.all([
        supabase.from('customers').select('*').eq('id', id).maybeSingle(),
        supabase.from('jobs').select('*').eq('customer_id', id).order('scheduled_date', { ascending: false }),
      ]);

      if (customerRes.data) setCustomer(customerRes.data);
      if (jobsRes.data) setJobs(jobsRes.data);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '--';
    return `$${amount.toFixed(2)}`;
  };

  const totalRevenue = jobs
    .filter((j) => j.status === 'completed' && j.price)
    .reduce((sum, j) => sum + (j.price || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Customer not found</p>
        <button
          onClick={() => navigate('/admin/customers')}
          className="mt-4 text-sky-600 hover:text-sky-700 font-medium"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {customer.first_name} {customer.last_name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  {customer.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[tag.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-slate-400 capitalize">Source: {customer.source}</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {customer.phone && (
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center group-hover:border-sky-300 transition-colors">
                    <Phone className="w-5 h-5 text-slate-600 group-hover:text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{customer.phone}</p>
                  </div>
                </a>
              )}

              {customer.email && (
                <a
                  href={`mailto:${customer.email}`}
                  className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center group-hover:border-sky-300 transition-colors">
                    <Mail className="w-5 h-5 text-slate-600 group-hover:text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[180px]">{customer.email}</p>
                  </div>
                </a>
              )}
            </div>

            {(customer.street_address || customer.city) && (
              <div className="mt-4 p-4 bg-slate-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="text-sm font-medium text-slate-900">
                      {[customer.street_address, customer.city, customer.zip_code].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {(customer.property_type || customer.stories || customer.square_footage || customer.solar_panel_count) && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Property Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {customer.property_type && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50">
                    <Home className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Property Type</p>
                      <p className="text-sm font-medium text-slate-900">{customer.property_type}</p>
                    </div>
                  </div>
                )}
                {customer.stories && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50">
                    <Layers className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Stories</p>
                      <p className="text-sm font-medium text-slate-900">{customer.stories}</p>
                    </div>
                  </div>
                )}
                {customer.square_footage && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50">
                    <Square className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Square Footage</p>
                      <p className="text-sm font-medium text-slate-900">{customer.square_footage}</p>
                    </div>
                  </div>
                )}
                {customer.solar_panel_count && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50">
                    <Sun className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Solar Panels</p>
                      <p className="text-sm font-medium text-slate-900">{customer.solar_panel_count}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {customer.notes && (
            <div className="bg-white border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Notes</h2>
              <div className="flex items-start gap-3 p-4 bg-slate-50">
                <MessageSquare className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 leading-relaxed">{customer.notes}</p>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Job History</h2>
              <button
                onClick={() => navigate(`/admin/schedule?customer=${customer.id}`)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Schedule Job
              </button>
            </div>

            {jobs.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No jobs yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {jobs.map((job) => {
                  const statusCfg = JOB_STATUS_CONFIG[job.status] || JOB_STATUS_CONFIG.scheduled;
                  return (
                    <div key={job.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">{job.title}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(job.scheduled_date)}
                            </span>
                            {job.scheduled_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {job.scheduled_time}
                              </span>
                            )}
                            {job.price !== null && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                {formatCurrency(job.price)}
                              </span>
                            )}
                          </div>
                          {job.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.services.map((s) => (
                                <span key={s} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 flex-shrink-0 ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50">
                <span className="text-sm text-slate-500">Total Jobs</span>
                <span className="text-sm font-semibold text-slate-900">{jobs.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50">
                <span className="text-sm text-slate-500">Completed</span>
                <span className="text-sm font-semibold text-green-600">
                  {jobs.filter((j) => j.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50">
                <span className="text-sm text-slate-500">Revenue</span>
                <span className="text-sm font-semibold text-slate-900">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50">
                <span className="text-sm text-slate-500">Customer Since</span>
                <span className="text-sm font-semibold text-slate-900">
                  {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {customer.phone && (
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 font-medium text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
              {customer.email && (
                <a
                  href={`mailto:${customer.email}`}
                  className="flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 font-medium text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              )}
              <button
                onClick={() => navigate(`/admin/schedule?customer=${customer.id}`)}
                className="flex items-center justify-center gap-2 w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 font-medium text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Schedule Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
