import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Add Facebook SDK types to window
declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: {
      init: (params: {
        appId: string;
        autoLogAppEvents: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      ui: (params: {
        method: string;
        href: string;
        quote?: string;
      }) => void;
    };
  }
}

interface MetaTagsProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function MetaTags({ 
  title, 
  description, 
  imageUrl = 'https://www.urantiabookpod.com/og-image.png',
  url,
  type = 'article'
}: MetaTagsProps) {
  // Set canonical URL to current page if not provided
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Insert Facebook SDK script if not already present
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('facebook-jssdk')) {
      // Create Facebook SDK script
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      // Initialize FB SDK
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: '', // You can add your Facebook App ID here if you have one
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v18.0'
        });
      };
    }
    
    return () => {
      // Clean up script on unmount
      const script = document.getElementById('facebook-jssdk');
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Urantia Book Podcast" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@UrantiaBookPod" />
    </Helmet>
  );
} 