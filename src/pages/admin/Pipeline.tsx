import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  GripVertical,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react';

interface Lead {
  id: string;
  services: string[];
  property_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  zip_code: string;
  preferred_timeframe: string;
  status: string;
  created_at: string;
}

const COLUMNS = [
  { status: 'new', label: 'New', accent: 'bg-sky-500', cardBorder: 'border-l-sky-500', badge: 'bg-sky-100 text-sky-700' },
  { status: 'contacted', label: 'Contacted', accent: 'bg-amber-500', cardBorder: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700' },
  { status: 'quoted', label: 'Quoted', accent: 'bg-blue-500', cardBorder: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700' },
  { status: 'won', label: 'Won', accent: 'bg-green-500', cardBorder: 'border-l-green-500', badge: 'bg-green-100 text-green-700' },
  { status: 'lost', label: 'Lost', accent: 'bg-slate-400', cardBorder: 'border-l-slate-400', badge: 'bg-slate-100 text-slate-600' },
] as const;

const TIMEFRAME_LABELS: Record<string, string> = {
  asap: 'ASAP',
  'this-week': 'This Week',
  'next-week': 'Next Week',
  'this-month': 'This Month',
  flexible: 'Flexible',
};

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchLeads = useCallback(async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('id, services, property_type, first_name, last_name, email, phone, city, zip_code, preferred_timeframe, status, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) setLeads(data);
    setLoading(false);
  }, []);

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
      lead.phone.includes(q) ||
      lead.services.some((s) => s.toLowerCase().includes(q))
    );
  });

  const getColumnLeads = (status: string) =>
    filteredLeads.filter((l) => l.status === status);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', leadId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLeadId(null);
    setDropTarget(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(status);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDropTarget(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-slate-500 text-sm mt-1">
            {leads.length} total leads &middot; Drag cards to update status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/leads')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <List className="w-4 h-4" />
            List View
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="grid grid-cols-5 gap-4 pb-4"
      >
        {COLUMNS.map((col) => {
          const columnLeads = getColumnLeads(col.status);
          const isDropping = dropTarget === col.status && draggedLeadId;
          return (
            <div
              key={col.status}
              className={`min-w-0 flex flex-col bg-slate-50 border border-slate-200 transition-colors ${
                isDropping ? 'bg-slate-100 border-slate-300' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.status)}
            >
              <div className="px-4 py-3 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 ${col.accent}`} />
                    <span className="text-sm font-semibold text-slate-900">{col.label}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 ${col.badge}`}>
                    {columnLeads.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
                {columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => navigate(`/admin/leads/${lead.id}`)}
                    className={`bg-white border border-slate-200 border-l-[3px] ${col.cardBorder} p-3 cursor-pointer hover:shadow-sm transition-all group ${
                      draggedLeadId === lead.id ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>

                    <div className="space-y-1.5">
                      {lead.services.length > 0 && (
                        <p className="text-xs text-slate-500 truncate">
                          {lead.services.slice(0, 2).join(', ')}
                          {lead.services.length > 2 && ` +${lead.services.length - 2}`}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {lead.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.city}
                          </span>
                        )}
                        {lead.preferred_timeframe && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {TIMEFRAME_LABELS[lead.preferred_timeframe] || lead.preferred_timeframe}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={`mailto:${lead.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatTimeAgo(lead.created_at)}
                      </span>
                    </div>
                  </div>
                ))}

                {columnLeads.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-xs text-slate-400">
                    {searchQuery ? 'No matches' : 'No leads'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
