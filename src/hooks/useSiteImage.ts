import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const SUPABASE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-site-images`;

export function useSiteImage(key: string, fallbackSrc: string): { src: string; loading: boolean } {
  const [src, setSrc] = useState(fallbackSrc);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('image_data, content_type')
          .eq('key', key)
          .eq('is_public', true)
          .maybeSingle();

        if (!cancelled && data?.image_data) {
          setSrc(`data:${data.content_type};base64,${data.image_data}`);
          setLoading(false);
          return;
        }

        if (!cancelled && !data) {
          await seedImage(key, fallbackSrc);
        }
      } catch {
        // fallback remains
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [key, fallbackSrc]);

  return { src, loading };
}

async function seedImage(key: string, localPath: string) {
  try {
    const response = await fetch(localPath);
    if (!response.ok) return;

    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    await fetch(SUPABASE_FUNCTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        key,
        image_data: base64,
        content_type: blob.type || 'image/jpeg',
      }),
    });
  } catch {
    // seeding failed silently, local fallback still works
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
