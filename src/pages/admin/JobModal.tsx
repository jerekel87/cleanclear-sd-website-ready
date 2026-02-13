import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  X,
  Trash2,
} from 'lucide-react';

interface Job {
  id: string;
  customer_id: string;
  title: string;
  services: string[];
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number;
  price: number | null;
  notes: string;
  crew_notes: string;
}

interface CustomerOption {
  id: string;
  first_name: string;
  last_name: string;
}

interface JobModalProps {
  date: string;
  job: Job | null;
  customers: CustomerOption[];
  preselectedCustomerId: string | null;
  onClose: () => void;
  onSaved: () => void;
}

const SERVICE_OPTIONS = [
  'Window Cleaning',
  'Solar Panel Cleaning',
  'Pressure Washing',
  'Gutter Cleaning',
  'Screen Cleaning',
  'Roof Cleaning',
  'House Washing',
];

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function JobModal({ date, job, customers, preselectedCustomerId, onClose, onSaved }: JobModalProps) {
  const isEditing = !!job;

  const [form, setForm] = useState({
    customer_id: job?.customer_id || preselectedCustomerId || '',
    title: job?.title || '',
    services: job?.services || [],
    status: job?.status || 'scheduled',
    scheduled_date: job?.scheduled_date || date,
    scheduled_time: job?.scheduled_time || '',
    estimated_duration: job?.estimated_duration || 60,
    price: job?.price !== null && job?.price !== undefined ? String(job.price) : '',
    notes: job?.notes || '',
    crew_notes: job?.crew_notes || '',
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  useEffect(() => {
    if (!form.title && form.services.length > 0) {
      setForm((prev) => ({ ...prev, title: prev.services[0] }));
    }
  }, [form.services]);

  const handleSave = async () => {
    if (!form.customer_id || !form.title.trim() || !form.scheduled_date) return;
    setSaving(true);

    const payload = {
      customer_id: form.customer_id,
      title: form.title.trim(),
      services: form.services,
      status: form.status,
      scheduled_date: form.scheduled_date,
      scheduled_time: form.scheduled_time,
      estimated_duration: form.estimated_duration,
      price: form.price ? parseFloat(form.price) : null,
      notes: form.notes.trim(),
      crew_notes: form.crew_notes.trim(),
      updated_at: new Date().toISOString(),
      ...(form.status === 'completed' && !job?.status?.includes('completed')
        ? { completed_at: new Date().toISOString() }
        : {}),
    };

    if (isEditing && job) {
      await supabase.from('jobs').update(payload).eq('id', job.id);
    } else {
      await supabase.from('jobs').insert(payload);
    }

    setSaving(false);
    onSaved();
  };

  const handleDelete = async () => {
    if (!job) return;
    setDeleting(true);
    await supabase.from('jobs').delete().eq('id', job.id);
    setDeleting(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white border border-slate-200 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? 'Edit Job' : 'New Job'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Customer *</label>
            <select
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
            >
              <option value="">Select customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Job Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Window Cleaning - Full House"
              className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Services</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((service) => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    form.services.includes(service)
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Date *</label>
              <input
                type="date"
                value={form.scheduled_date}
                onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Time</label>
              <input
                type="time"
                value={form.scheduled_time}
                onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Duration (min)</label>
              <input
                type="number"
                value={form.estimated_duration}
                onChange={(e) => setForm({ ...form, estimated_duration: parseInt(e.target.value) || 0 })}
                min={0}
                step={15}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Price ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                min={0}
                step={0.01}
                placeholder="0.00"
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              />
            </div>
          </div>

          {isEditing && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="Job notes..."
              className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Crew Notes</label>
            <textarea
              value={form.crew_notes}
              onChange={(e) => setForm({ ...form, crew_notes: e.target.value })}
              rows={2}
              placeholder="Instructions for the crew..."
              className="w-full px-3 py-2.5 border border-slate-200 text-sm focus:border-slate-400 outline-none resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            {isEditing && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            {confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500">Confirm?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.customer_id || !form.title.trim() || !form.scheduled_date}
              className="px-4 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
