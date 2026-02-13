import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useContentEditor<T extends Record<string, unknown>>(
  sectionKey: string,
  defaults: T
) {
  const { user } = useAuth();
  const [content, setContent] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    supabase
      .from('website_content')
      .select('content')
      .eq('section_key', sectionKey)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError('Failed to load content');
          setContent(defaults);
        } else if (data?.content) {
          setContent({ ...defaults, ...(data.content as T) });
        } else {
          setContent(defaults);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [sectionKey]);

  const updateField = useCallback((key: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    setError('');

    const { data: existing } = await supabase
      .from('website_content')
      .select('id')
      .eq('section_key', sectionKey)
      .maybeSingle();

    const payload = {
      content,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    };

    let saveError;
    if (existing) {
      const { error: e } = await supabase
        .from('website_content')
        .update(payload)
        .eq('section_key', sectionKey);
      saveError = e;
    } else {
      const { error: e } = await supabase
        .from('website_content')
        .insert({ section_key: sectionKey, ...payload });
      saveError = e;
    }

    if (saveError) {
      setError('Failed to save changes');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }, [content, sectionKey, user?.id]);

  return { content, setContent, updateField, save, loading, saving, saved, error };
}
