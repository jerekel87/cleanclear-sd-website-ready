import { Save, Loader2, CheckCircle } from 'lucide-react';
import { useContentEditor } from '../../../hooks/useContentEditor';

export interface TextField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
  helpText?: string;
}

interface TextSectionEditorProps {
  sectionKey: string;
  title: string;
  subtitle: string;
  fields: TextField[];
  defaults: Record<string, string>;
}

export default function TextSectionEditor({ sectionKey, title, subtitle, fields, defaults }: TextSectionEditorProps) {
  const { content, updateField, save, loading, saving, saved, error } = useContentEditor(sectionKey, defaults);

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
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-900/60 text-white px-5 py-2.5 text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white border border-slate-200 divide-y divide-slate-200">
        {fields.map((field) => (
          <div key={field.key} className="p-6">
            <label className="block text-sm font-medium text-slate-900 mb-1.5">{field.label}</label>
            {field.helpText && <p className="text-xs text-slate-500 mb-2">{field.helpText}</p>}
            {field.type === 'textarea' ? (
              <textarea
                value={(content[field.key] as string) || ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm resize-none"
              />
            ) : (
              <input
                type="text"
                value={(content[field.key] as string) || ''}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
