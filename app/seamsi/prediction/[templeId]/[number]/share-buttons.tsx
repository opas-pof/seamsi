'use client';
import { Facebook, Twitter } from 'lucide-react';

export default function ShareButtons() {
  const share = (platform: 'facebook' | 'twitter') => {
    if (typeof window === 'undefined') return;
    const currentUrl = window.location.href;
    const text = document.title;
    const url = platform === 'facebook'
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
      : `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  return (
    <div className="flex gap-4 items-center">
      แชร์
      <button className="bg-blue-800 rounded-full p-2 text-white" onClick={() => share('facebook')}>
        <Facebook className="h-4 w-4" />
      </button>
      <button className="bg-blue-500 rounded-full p-2 text-white" onClick={() => share('twitter')}>
        <Twitter className="h-4 w-4" />
      </button>
    </div>
  );
}

