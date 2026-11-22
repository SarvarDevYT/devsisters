import React from 'react';

/**
 * Helper utilities for YouTube video embeds, thumbnails, and custom UI
 */

export function getYouTubeId(url: string): string | null {
  if (!url) return null;

  // Clean whitespace
  const clean = url.trim();

  // Pattern match
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = clean.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

export function getYouTubeEmbedUrl(url: string, autoplay: boolean = true): string {
  const videoId = getYouTubeId(url);
  if (videoId) {
    // youtube-nocookie.com provides higher privacy and cleaner embeds without third-party cookie alerts
    const autoParam = autoplay ? 'autoplay=1&' : '';
    return `https://www.youtube-nocookie.com/embed/${videoId}?${autoParam}rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  }
  return url;
}

export function getYouTubeThumbnail(url: string, quality: 'hq' | 'maxres' = 'hq'): string {
  const videoId = getYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/${quality === 'maxres' ? 'maxresdefault' : 'hqdefault'}.jpg`;
  }
  return '';
}

export function YouTubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
