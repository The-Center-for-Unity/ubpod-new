import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, X as XIcon, Facebook, Linkedin, Mail, MessageCircle } from 'lucide-react';

interface SocialShareMenuProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShareMenu({ url, title, description = '' }: SocialShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Use Web Share API if available (which will use native share options)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        setNotification('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        // User likely canceled - no need for notification
      }
    } else {
      setIsOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setNotification('Link copied to clipboard!');
        setIsOpen(false);
      })
      .catch(() => {
        setNotification('Failed to copy link');
      });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Share to X (Twitter)
  const shareToX = () => {
    const encodedText = encodeURIComponent(`${title}\n\n${url}`);
    window.open(`https://x.com/intent/tweet?text=${encodedText}`, '_blank');
    setIsOpen(false);
  };

  // Share to Facebook
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setIsOpen(false);
  };

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 
      '_blank'
    );
    setIsOpen(false);
  };

  // Share via Email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setIsOpen(false);
  };

  // Share via SMS (Text Message)
  const shareViaSMS = () => {
    const body = encodeURIComponent(`${title}\n${url}`);
    window.open(`sms:?&body=${body}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 hover:bg-navy transition-colors rounded-md"
        aria-label="Share"
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-navy-dark border border-white/10 z-50">
          <div className="py-2 px-3 border-b border-white/10">
            <h3 className="text-white text-sm font-medium">Share this content</h3>
          </div>
          <div className="py-2">
            <button 
              onClick={copyToClipboard}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/50 text-left text-sm"
            >
              <Copy size={16} className="mr-3" />
              Copy link
            </button>
            
            <button 
              onClick={shareToX}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/50 text-left text-sm"
            >
              <XIcon size={16} className="mr-3" />
              Share to X
            </button>
            
            <button 
              onClick={shareToFacebook}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/50 text-left text-sm"
            >
              <Facebook size={16} className="mr-3" />
              Share to Facebook
            </button>
            
            <button 
              onClick={shareToLinkedIn}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/50 text-left text-sm"
            >
              <Linkedin size={16} className="mr-3" />
              Share to LinkedIn
            </button>
            
            <button 
              onClick={shareViaEmail}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/50 text-left text-sm"
            >
              <Mail size={16} className="mr-3" />
              Share via email
            </button>
            
            <button 
              onClick={shareViaSMS}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/50 text-left text-sm"
            >
              <MessageCircle size={16} className="mr-3" />
              Share via text
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300">
          {notification}
        </div>
      )}
    </div>
  );
} 