'use client';

import { Copy, Check, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'copy';

interface ShareButtonProps {
  url: string;
  title: string;
  platform: Platform;
}

const icons: Record<Platform, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  copy: <Copy className="w-4 h-4" />,
};

const labels: Record<Platform, string> = {
  facebook: 'Compartir en Facebook',
  twitter: 'Compartir en X / Twitter',
  linkedin: 'Compartir en LinkedIn',
  copy: 'Copiar enlace',
};

export default function ShareButton({ title, platform }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleShare = () => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls: Record<Platform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      copy: '',
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
    }
  };

  return (
    <button
      onClick={handleShare}
      title={labels[platform]}
      aria-label={labels[platform]}
      className="w-9 h-9 rounded-full border border-base-200 bg-base-100 flex items-center justify-center text-base-content/40 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-200"
    >
      {platform === 'copy' && copied ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        icons[platform]
      )}
    </button>
  );
}
