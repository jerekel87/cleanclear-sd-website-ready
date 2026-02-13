import { useRef } from 'react';
import { Save, Loader2, CheckCircle, Plus, Trash2, Upload, Image } from 'lucide-react';
import { useContentEditor } from '../../../hooks/useContentEditor';
import { supabase } from '../../../lib/supabase';

interface GalleryProject {
  before: string;
  after: string;
  label: string;
  location: string;
}

const DEFAULT_PROJECTS: GalleryProject[] = [
  {
    before: 'https://images.pexels.com/photos/5691525/pexels-photo-5691525.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Power Washing',
    location: 'Carlsbad, CA',
  },
  {
    before: 'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'House Exterior Wash',
    location: 'Encinitas, CA',
  },
  {
    before: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Roof Washing',
    location: 'Del Mar, CA',
  },
  {
    before: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=800',
    label: 'Window Cleaning',
    location: 'Oceanside, CA',
  },
];

const GALLERY_DEFAULTS = {
  label: 'Our Work',
  title: 'Our Work Speaks for Itself',
  description: 'Our gallery showcases real projects across San Diego County. Drag the slider to discover the level of care and precision we bring to every job.',
  projects: DEFAULT_PROJECTS,
};

export default function GalleryEditor() {
  const { content, updateField, save, loading, saving, saved, error } = useContentEditor('gallery', GALLERY_DEFAULTS);
  const projects = (content.projects as GalleryProject[]) || [];

  const setProjects = (updated: GalleryProject[]) => updateField('projects', updated);

  const addProject = () => {
    setProjects([...projects, { before: '', after: '', label: '', location: '' }]);
  };

  const removeProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };

  const updateProject = (idx: number, key: keyof GalleryProject, value: string) => {
    const updated = [...projects];
    updated[idx] = { ...updated[idx], [key]: value };
    setProjects(updated);
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
          <h2 className="text-xl font-semibold text-slate-900">Gallery Section</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your before/after project gallery.</p>
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

      {error && <div className="mb-6 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white border border-slate-200 divide-y divide-slate-200 mb-6">
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-900 mb-1.5">Section Label</label>
          <input
            type="text"
            value={(content.label as string) || ''}
            onChange={(e) => updateField('label', e.target.value)}
            placeholder="e.g. OUR WORK"
            className="w-full px-4 py-3 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
          />
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-900 mb-1.5">Section Title</label>
          <input
            type="text"
            value={(content.title as string) || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. Our Work Speaks for Itself"
            className="w-full px-4 py-3 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
          />
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-slate-900 mb-1.5">Section Description</label>
          <textarea
            value={(content.description as string) || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Before/After Projects ({projects.length})</h3>
        <button onClick={addProject} className="flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, idx) => (
          <GalleryProjectCard
            key={idx}
            project={project}
            index={idx}
            onUpdate={updateProject}
            onRemove={removeProject}
          />
        ))}

        {projects.length === 0 && (
          <div className="bg-white border border-slate-200 border-dashed p-8 text-center">
            <Image className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No projects added yet.</p>
            <button onClick={addProject} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700">
              <Plus className="w-4 h-4" />
              Add your first before/after project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryProjectCard({
  project,
  index,
  onUpdate,
  onRemove,
}: {
  project: GalleryProject;
  index: number;
  onUpdate: (idx: number, key: keyof GalleryProject, value: string) => void;
  onRemove: (idx: number) => void;
}) {
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File, field: 'before' | 'after') => {
    const ext = file.name.split('.').pop();
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from('website-images')
      .upload(fileName, file);

    if (error) {
      alert('Upload failed. You can paste a URL instead.');
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('website-images')
      .getPublicUrl(data.path);

    onUpdate(index, field, publicUrl);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file, field);
    e.target.value = '';
  };

  return (
    <div className="bg-white border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">
          Project {index + 1}{project.label ? ` — ${project.label}` : ''}
        </span>
        <button onClick={() => onRemove(index)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Remove project">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Project Name</label>
          <input
            type="text"
            value={project.label}
            onChange={(e) => onUpdate(index, 'label', e.target.value)}
            placeholder="e.g. Power Washing"
            className="w-full px-3 py-2.5 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
          <input
            type="text"
            value={project.location}
            onChange={(e) => onUpdate(index, 'location', e.target.value)}
            placeholder="e.g. Carlsbad, CA"
            className="w-full px-3 py-2.5 border border-slate-200 bg-white focus:border-slate-400 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Before Image</label>
          <div className="space-y-2">
            {project.before && (
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img src={project.before} alt="Before" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold uppercase">Before</span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={project.before}
                onChange={(e) => onUpdate(index, 'before', e.target.value)}
                placeholder="Paste image URL..."
                className="flex-1 px-3 py-2 border border-slate-200 bg-white focus:border-slate-400 outline-none text-xs"
              />
              <input ref={beforeInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, 'before')} />
              <button
                onClick={() => beforeInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">After Image</label>
          <div className="space-y-2">
            {project.after && (
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img src={project.after} alt="After" className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-600/80 text-white text-[10px] font-bold uppercase">After</span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={project.after}
                onChange={(e) => onUpdate(index, 'after', e.target.value)}
                placeholder="Paste image URL..."
                className="flex-1 px-3 py-2 border border-slate-200 bg-white focus:border-slate-400 outline-none text-xs"
              />
              <input ref={afterInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, 'after')} />
              <button
                onClick={() => afterInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
