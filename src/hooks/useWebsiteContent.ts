import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useWebsiteContent<T extends Record<string, unknown>>(
  sectionKey: string,
  defaults: T
): { content: T; loading: boolean } {
  const [content, setContent] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('website_content')
      .select('content')
      .eq('section_key', sectionKey)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.content) {
          setContent({ ...defaults, ...(data.content as T) });
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [sectionKey]);

  return { content, loading };
}
