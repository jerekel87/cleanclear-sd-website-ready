import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url';
  placeholder?: string;
  helpText?: string;
}

interface SectionEditorProps {
  sectionKey: string;
  sectionTitle: string;
  fields: FieldDef[];
}

export default function SectionEditor({ sectionKey, sectionTitle, fields }: SectionEditorProps) {
  const { user } = useAuth();
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  const fetchContent = async () => {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('website_content')
      .select('content')
      .eq('section_key', sectionKey)
      .maybeSingle();

    if (fetchError) {
      setError('Failed to load content');
    } else if (data?.content) {
      setContent(data.content as Record<string, string>);
    } else {
      setContent({});
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);

    const { data: existing } = await supabase
      .from('website_content')
      .select('id')
      .eq('section_key', sectionKey)
      .maybeSingle();

    let saveError;

    if (existing) {
      const { error: updateErr } = await supabase
        .from('website_content')
        .update({
          content,
          updated_at: new Date().toISOString(),
          updated_by: user?.id,
        })
        .eq('section_key', sectionKey);
      saveError = updateErr;
    } else {
      const { error: insertErr } = await supabase
        .from('website_content')
        .insert({
          section_key: sectionKey,
          content,
          updated_by: user?.id,
        });
      saveError = insertErr;
    }

    if (saveError) {
      setError('Failed to save changes');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  };

  const updateField = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{sectionTitle}</h2>
          <p className="text-sm text-slate-500 mt-1">Edit the content displayed in the {sectionTitle} section of your website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-900/60 text-white px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200">
        <div className="divide-y divide-slate-200">
          {fields.map((field) => (
            <div key={field.key} className="p-6">
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {field.label}
              </label>
              {field.helpText && (
                <p className="text-xs text-slate-500 mb-2">{field.helpText}</p>
              )}
              {field.type === 'textarea' ? (
                <textarea
                  value={content[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm resize-none"
                />
              ) : (
                <input
                  type={field.type === 'url' ? 'url' : 'text'}
                  value={content[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                  className="w-full px-4 py-3 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
