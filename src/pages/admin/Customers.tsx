import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Search,
  ChevronDown,
  Users,
  Mail,
  Phone,
  MapPin,
  Plus,
  Tag,
} from 'lucide-react';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  zip_code: string;
  tags: string[];
  source: string;
  created_at: string;
  job_count: number;
}

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'google', label: 'Google' },
  { value: 'yelp', label: 'Yelp' },
  { value: 'other', label: 'Other' },
];

const TAG_COLORS: Record<string, string> = {
  residential: 'bg-sky-100 text-sky-700',
  commercial: 'bg-amber-100 text-amber-700',
  hoa: 'bg-green-100 text-green-700',
  'property manager': 'bg-blue-100 text-blue-700',
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const { data: customerData, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !customerData) {
      setLoading(false);
      return;
    }

    const customerIds = customerData.map((c) => c.id);
    let jobCounts: Record<string, number> = {};

    if (customerIds.length > 0) {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('customer_id')
        .in('customer_id', customerIds);

      if (jobs) {
        jobCounts = jobs.reduce<Record<string, number>>((acc, job) => {
          acc[job.customer_id] = (acc[job.customer_id] || 0) + 1;
          return acc;
        }, {});
      }
    }

    setCustomers(
      customerData.map((c) => ({
        ...c,
        job_count: jobCounts[c.id] || 0,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter((c) => {
    if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.first_name.toLowerCase().includes(q) ||
      c.last_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">{customers.length} total customers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="bg-white border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, or city..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
            />
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="appearance-none w-full sm:w-auto pl-4 pr-9 py-2.5 border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:border-slate-400 outline-none cursor-pointer"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No customers found</p>
            <p className="text-slate-400 text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'Add your first customer or convert a won lead'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Jobs</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => navigate(`/admin/customers/${customer.id}`)}
                      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{customer.first_name} {customer.last_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 capitalize">{customer.source}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Mail className="w-3.5 h-3.5" />
                            {customer.email || '--'}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Phone className="w-3.5 h-3.5" />
                            {customer.phone || '--'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {customer.city || '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.length > 0 ? customer.tags.map((tag) => (
                            <span key={tag} className={`text-xs px-2 py-0.5 font-medium ${TAG_COLORS[tag.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
                              {tag}
                            </span>
                          )) : (
                            <span className="text-xs text-slate-400">--</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-900">{customer.job_count}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {formatDate(customer.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => navigate(`/admin/customers/${customer.id}`)}
                  className="w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{customer.first_name} {customer.last_name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                        {customer.email && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{customer.email}</span>
                          </span>
                        )}
                      </div>
                      {customer.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {customer.tags.map((tag) => (
                            <span key={tag} className={`text-xs px-2 py-0.5 font-medium ${TAG_COLORS[tag.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-xs text-slate-400">{formatDate(customer.created_at)}</span>
                      <span className="text-xs text-slate-500">{customer.job_count} jobs</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="px-6 py-3 border-t border-slate-200 text-sm text-slate-500">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            setShowAddModal(false);
            fetchCustomers();
          }}
        />
      )}
    </div>
  );
}

function AddCustomerModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street_address: '',
    city: '',
    zip_code: '',
    property_type: '',
    tags: [] as string[],
    source: 'website',
    notes: '',
  });

  const TAG_OPTIONS = ['Residential', 'Commercial', 'HOA', 'Property Manager'];

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSave = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) return;
    setSaving(true);

    const { error } = await supabase.from('customers').insert({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      street_address: form.street_address.trim(),
      city: form.city.trim(),
      zip_code: form.zip_code.trim(),
      property_type: form.property_type,
      tags: form.tags,
      source: form.source,
      notes: form.notes.trim(),
    });

    if (!error) onSaved();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Add Customer</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">First Name *</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Last Name *</label>
              <input
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Street Address</label>
            <input
              value={form.street_address}
              onChange={(e) => setForm({ ...form, street_address: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Zip Code</label>
              <input
                value={form.zip_code}
                onChange={(e) => setForm({ ...form, zip_code: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
            >
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="google">Google</option>
              <option value="yelp">Yelp</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    form.tags.includes(tag)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.first_name.trim() || !form.last_name.trim()}
            className="px-4 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Customer'}
          </button>
        </div>
      </div>
    </div>
  );
}
