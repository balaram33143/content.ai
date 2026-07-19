'use client';

import { useState, useEffect } from 'react';
import type { YouTubePreview } from '@/types';
import { extractVideoId, YOUTUBE_URL_REGEX } from '@/config/workflow';

export function useYoutubePreview(url: string) {
  const [preview, setPreview] = useState<YouTubePreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !YOUTUBE_URL_REGEX.test(url)) {
      setPreview(null);
      setError(null);
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      setPreview(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    fetch(oembedUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch video metadata');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setPreview({
          videoId,
          title: data.title || 'Unknown title',
          channelName: data.author_name || 'Unknown channel',
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          duration: '',
        });
      })
      .catch(() => {
        if (cancelled) return;
        setPreview({
          videoId,
          title: 'Video metadata unavailable',
          channelName: '—',
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          duration: '',
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { preview, loading, error };
}
