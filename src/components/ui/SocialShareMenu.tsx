import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, X as XIcon, Facebook, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SocialShareMenuProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShareMenu({ url, title, description = '' }: SocialShareMenuProps) {
  // Explicitly use the common namespace to avoid conflicts with episode.json's share section
  const { t } = useTranslation('common', { nsMode: 'fallback' });
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

  // Check if we're on mobile or desktop
  const isMobile = () => {
    // Simple check for mobile devices
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Handles the share button click
  const handleShareClick = () => {
    // Only use Web Share API on mobile
    if (typeof navigator.share !== 'undefined' && isMobile()) {
      shareViaNative();
    } else {
      // On desktop, always show our custom menu
      setIsOpen(!isOpen);
    }
  };

  // Use Web Share API (only on mobile)
  const shareViaNative = async () => {
    try {
      await navigator.share({
        title: `${title} | Urantia Book Podcast`,
        text: description,
        url,
      });
      setNotification(t('share.shared_success'));
    } catch (error) {
      console.error('Error sharing:', error);
      // User likely canceled - no need for notification
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setNotification(t('share.link_copied'));
        setIsOpen(false);
      })
      .catch(() => {
        setNotification(t('share.rss_copy_failed'));
      });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Share to X (Twitter)
  const shareToX = () => {
    const shareText = `${title} | Urantia Book Podcast\n\n${description}\n\n${url}`;
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    
    // Open in a popup window with proper dimensions
    const width = 550;
    const height = 420;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      shareUrl,
      'x-share-dialog',
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,directories=0,scrollbars=0`
    );
    
    setIsOpen(false);
  };

  // Share to Facebook
  const shareToFacebook = () => {
    // First, copy the content to clipboard to make it easy for the user to paste
    const shareText = `${title} | Urantia Book Podcast\n\n${description}\n\nListen to this episode: ${url}`;
    
    // Copy the text to clipboard
    navigator.clipboard.writeText(shareText)
      .then(() => {
        // Show a notification that text has been copied
        setNotification(t('share.content_copied'));
        
        // Use the simpler URL without the quote parameter since Facebook ignores it
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        
        // Open in a popup window with proper dimensions
        const width = 550;
        const height = 400;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        window.open(
          facebookUrl,
          'facebook-share-dialog',
          `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,directories=0,scrollbars=0`
        );
      })
      .catch(() => {
        // If clipboard fails, still open Facebook
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(
          facebookUrl,
          'facebook-share-dialog',
          `width=550,height=400,top=${window.screen.height/2-200},left=${window.screen.width/2-275}`
        );
      });
    
    setIsOpen(false);
    
    // Clear notification after 5 seconds (longer time since user needs to read it)
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    
    // Open in a popup window with proper dimensions
    const width = 550;
    const height = 450;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      shareUrl,
      'linkedin-share-dialog',
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,location=0,menubar=0,directories=0,scrollbars=0`
    );
    
    setIsOpen(false);
  };

  // Share via Email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${title} | Urantia Book Podcast`);
    const body = encodeURIComponent(`${description}\n\nListen to this episode: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setIsOpen(false);
  };

  // Share via SMS (Text Message)
  const shareViaSMS = () => {
    const body = encodeURIComponent(`${title} | Urantia Book Podcast\n\nListen to this episode: ${url}`);
    window.open(`sms:?&body=${body}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={handleShareClick}
        className="flex items-center gap-2 px-4 py-2 bg-navy-light/70 text-white/90 hover:bg-navy transition-colors rounded-md"
        aria-label="Share"
      >
        <Share2 size={18} />
        <span>{t('share.button')}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-navy/95 backdrop-blur-md border border-white/10 z-50">
          <div className="py-2 px-3 border-b border-white/10">
            <h3 className="text-white text-sm font-medium">{t('share.title')}</h3>
          </div>
          <div className="py-2">
            <button 
              onClick={copyToClipboard}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/80 text-left text-sm"
            >
              <Copy size={16} className="mr-3" />
              {t('share.copy_link')}
            </button>
            
            <button 
              onClick={shareToX}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/80 text-left text-sm"
            >
              <XIcon size={16} className="mr-3" />
              {t('share.share_to_x')}
            </button>
            
            <button 
              onClick={shareToFacebook}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/80 text-left text-sm"
            >
              <Facebook size={16} className="mr-3" />
              {t('share.share_to_facebook')}
            </button>
            
            <button 
              onClick={shareToLinkedIn}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/80 text-left text-sm"
            >
              <Linkedin size={16} className="mr-3" />
              {t('share.share_to_linkedin')}
            </button>
            
            <button 
              onClick={shareViaEmail}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/80 text-left text-sm"
            >
              <Mail size={16} className="mr-3" />
              {t('share.share_via_email')}
            </button>
            
            <button 
              onClick={shareViaSMS}
              className="w-full flex items-center px-4 py-2 text-white/90 hover:bg-navy-light/80 text-left text-sm"
            >
              <MessageCircle size={16} className="mr-3" />
              {t('share.share_via_text')}
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