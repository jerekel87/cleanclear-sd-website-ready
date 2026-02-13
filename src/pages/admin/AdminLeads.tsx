import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Search,
  RefreshCw,
  ChevronDown,
  Briefcase,
  Filter,
  ArrowRight,
} from 'lucide-react';

interface Lead {
  id: string;
  services: string[];
  property_type: string;
  stories: string;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  preferred_timeframe: string;
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

function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('leads')
      .select('id, services, property_type, stories, first_name, last_name, email, city, preferred_timeframe, status, created_at')
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

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.first_name.toLowerCase().includes(q) ||
      lead.last_name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    const opt = STATUS_OPTIONS.find((o) => o.value === status);
    return opt || { value: status, label: status, color: 'bg-gray-100 text-gray-600' };
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
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Leads</h1>
        <p className="text-gray-500 mt-2">Quote requests from the website</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(statusFilter === opt.value ? 'all' : opt.value)}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              statusFilter === opt.value
                ? 'border-gray-900 bg-white shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-3xl font-bold text-gray-900">{statusCounts[opt.value] || 0}</p>
            <p className="text-sm text-gray-500 mt-1">{opt.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, service..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none text-sm"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-10 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={fetchLeads}
              className="flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-24">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No leads found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'New leads will appear here when submitted'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Services</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Property</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Timing</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Received</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => {
                    const badge = getStatusBadge(lead.status);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => navigate(`/admin/leads/${lead.id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{lead.first_name} {lead.last_name}</p>
                          <p className="text-gray-500 text-sm mt-0.5">{lead.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {lead.services.slice(0, 2).map((s) => (
                              <span key={s} className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                                {s}
                              </span>
                            ))}
                            {lead.services.length > 2 && (
                              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-md font-medium">
                                +{lead.services.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {lead.property_type && <span>{lead.property_type}</span>}
                          {lead.stories && <span> / {lead.stories}</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {TIMEFRAME_LABELS[lead.preferred_timeframe] || '--'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                          {formatDateShort(lead.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
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
                    onClick={() => navigate(`/admin/leads/${lead.id}`)}
                    className="w-full text-left px-5 py-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{lead.first_name} {lead.last_name}</p>
                        <p className="text-gray-500 text-sm mt-1 truncate">{lead.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-gray-400 text-xs">{formatDateShort(lead.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {lead.services.slice(0, 3).map((s) => (
                        <span key={s} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
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

        <div className="px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>
      </div>
    </div>
  );
}

export default AdminLeads;
