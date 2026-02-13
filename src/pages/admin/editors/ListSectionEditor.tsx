import { Save, Loader2, CheckCircle, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useContentEditor } from '../../../hooks/useContentEditor';
import type { TextField } from './TextSectionEditor';

interface ItemField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

interface ListSectionEditorProps {
  sectionKey: string;
  title: string;
  subtitle: string;
  textFields: TextField[];
  arrayKey: string;
  itemLabel: string;
  itemFields: ItemField[];
  defaults: Record<string, unknown>;
}

export default function ListSectionEditor({
  sectionKey, title, subtitle, textFields, arrayKey, itemLabel, itemFields, defaults,
}: ListSectionEditorProps) {
  const { content, updateField, save, loading, saving, saved, error } = useContentEditor(sectionKey, defaults);
  const items = (content[arrayKey] as Record<string, string>[]) || [];

  const setItems = (newItems: Record<string, string>[]) => {
    updateField(arrayKey, newItems);
  };

  const addItem = () => {
    const empty: Record<string, string> = {};
    itemFields.forEach((f) => { empty[f.key] = ''; });
    setItems([...items, empty]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, key: string, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    setItems(updated);
  };

  const moveItem = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    setItems(updated);
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

      {textFields.length > 0 && (
        <div className="bg-white border border-slate-200 divide-y divide-slate-200 mb-6">
          {textFields.map((field) => (
            <div key={field.key} className="p-6">
              <label className="block text-sm font-medium text-slate-900 mb-1.5">{field.label}</label>
              {field.helpText && <p className="text-xs text-slate-500 mb-2">{field.helpText}</p>}
              {field.type === 'textarea' ? (
                <textarea
                  value={(content[field.key] as string) || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
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
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          {itemLabel}s ({items.length})
        </h3>
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {itemLabel}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">
                {itemLabel} {idx + 1}
                {item[itemFields[0]?.key] ? ` — ${item[itemFields[0].key]}` : ''}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30" title="Move up">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveItem(idx, 'down')} disabled={idx === items.length - 1} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30" title="Move down">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => removeItem(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {itemFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={item[field.key] || ''}
                      onChange={(e) => updateItem(idx, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item[field.key] || ''}
                      onChange={(e) => updateItem(idx, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-white border border-slate-200 border-dashed p-8 text-center">
            <p className="text-slate-500 text-sm">No {itemLabel.toLowerCase()}s added yet.</p>
            <button
              onClick={addItem}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              <Plus className="w-4 h-4" />
              Add your first {itemLabel.toLowerCase()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
