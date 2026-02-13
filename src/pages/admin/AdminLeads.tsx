import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Search,
  RefreshCw,
  ChevronDown,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  User,
  Briefcase,
  MessageSquare,
  Filter,
} from 'lucide-react';

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
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-sky-100 text-sky-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-amber-100 text-amber-700' },
  { value: 'quoted', label: 'Quoted', color: 'bg-blue-100 text-blue-700' },
  { value: 'won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: 'Lost', color: 'bg-gray-100 text-gray-600' },
] as const;

const TIMEFRAME_LABELS: Record<string, string> = {
  asap: 'ASAP',
  'this-week': 'This Week',
  'next-week': 'Next Week',
  'this-month': 'This Month',
  flexible: 'Flexible',
};

const TIME_LABELS: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  'no-preference': 'No Preference',
};

function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (!error && data) setLeads(data);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(leadId);
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setUpdatingStatus(null);
  };

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.first_name.toLowerCase().includes(q) ||
      lead.last_name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((o) => o.value === status);
    return opt || { value: status, label: status, color: 'bg-gray-100 text-gray-600' };
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statusCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Leads</h1>
        <p className="text-gray-500 text-sm mt-1">
          Quote requests from the website
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(statusFilter === opt.value ? 'all' : opt.value)}
            className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${
              statusFilter === opt.value
                ? 'border-navy-900 bg-white shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-extrabold text-navy-900">{statusCounts[opt.value] || 0}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{opt.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, service..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={fetchLeads}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold text-sm">No leads found</p>
            <p className="text-gray-400 text-xs mt-1">
              {searchQuery ? 'Try a different search term' : 'New leads will appear here when submitted'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Services</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Property</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Timing</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => {
                    const badge = getStatusBadge(lead.status);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="hover:bg-sky-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-navy-900">{lead.first_name} {lead.last_name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{lead.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {lead.services.slice(0, 2).map((s) => (
                              <span key={s} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                                {s}
                              </span>
                            ))}
                            {lead.services.length > 2 && (
                              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md font-medium">
                                +{lead.services.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 text-xs">
                          {lead.property_type && <span>{lead.property_type}</span>}
                          {lead.stories && <span> / {lead.stories}</span>}
                        </td>
                        <td className="px-4 py-3.5 text-gray-600 text-xs">
                          {TIMEFRAME_LABELS[lead.preferred_timeframe] || '--'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                          {formatDateShort(lead.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-gray-100">
              {filteredLeads.map((lead) => {
                const badge = getStatusBadge(lead.status);
                return (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="w-full text-left px-4 py-4 hover:bg-sky-50/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-navy-900 text-sm">{lead.first_name} {lead.last_name}</p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{lead.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-gray-400 text-[10px]">{formatDateShort(lead.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lead.services.slice(0, 3).map((s) => (
                        <span key={s} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={updateLeadStatus}
          updatingStatus={updatingStatus}
        />
      )}
    </div>
  );
}

function LeadDetailDrawer({
  lead,
  onClose,
  onStatusChange,
  updatingStatus,
}: {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  updatingStatus: string | null;
}) {
  const badge = STATUS_OPTIONS.find((o) => o.value === lead.status) || STATUS_OPTIONS[0];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in-right">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-extrabold text-navy-900 text-lg">Lead Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-extrabold text-navy-900">
                {lead.first_name} {lead.last_name}
              </h3>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <div className="space-y-2">
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-sky-600 transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
                {lead.phone}
              </a>
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-sky-600 transition-colors">
                <Mail className="w-4 h-4 text-gray-400" />
                {lead.email}
              </a>
              {(lead.street_address || lead.city) && (
                <div className="flex items-start gap-2.5 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span>{[lead.street_address, lead.city, lead.zip_code].filter(Boolean).join(', ')}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                {formatDate(lead.created_at)}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Services Requested</h4>
            <div className="flex flex-wrap gap-2">
              {lead.services.map((s) => (
                <span key={s} className="inline-block px-3 py-1.5 bg-sky-50 text-sky-700 text-xs rounded-lg font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {(lead.property_type || lead.stories || lead.square_footage) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Property Details</h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                {lead.property_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="text-navy-900 font-medium">{lead.property_type}</span>
                  </div>
                )}
                {lead.stories && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Stories</span>
                    <span className="text-navy-900 font-medium">{lead.stories}</span>
                  </div>
                )}
                {lead.square_footage && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Size</span>
                    <span className="text-navy-900 font-medium">{lead.square_footage}</span>
                  </div>
                )}
                {lead.solar_panel_count && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Solar Panels</span>
                    <span className="text-navy-900 font-medium">{lead.solar_panel_count}</span>
                  </div>
                )}
              </div>
              {lead.property_notes && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{lead.property_notes}</p>
              )}
            </div>
          )}

          {(lead.preferred_timeframe || lead.preferred_time) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Scheduling Preference</h4>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                {lead.preferred_timeframe && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-navy-900 font-medium">
                      {TIMEFRAME_LABELS[lead.preferred_timeframe] || lead.preferred_timeframe}
                    </span>
                  </div>
                )}
                {lead.preferred_time && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-navy-900 font-medium">
                      {TIME_LABELS[lead.preferred_time] || lead.preferred_time}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {lead.notes && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Additional Notes</h4>
              <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{lead.notes}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">Update Status</h4>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange(lead.id, opt.value)}
                  disabled={lead.status === opt.value || updatingStatus === lead.id}
                  className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all border-2 ${
                    lead.status === opt.value
                      ? `${opt.color} border-current opacity-100`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <a
              href={`mailto:${lead.email}`}
              className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-bold text-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLeads;
