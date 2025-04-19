import React from 'react';

interface HotjarAnalyticsProps {
  HOTJAR_ID: string;
}

export default function HotjarAnalytics({ HOTJAR_ID }: HotjarAnalyticsProps) {
  React.useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Hotjar tracking code
      (function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
        h.hj = h.hj || function() {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
        h._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }, [HOTJAR_ID]);

  return null;
} 