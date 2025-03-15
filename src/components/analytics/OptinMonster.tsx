import React from 'react';

interface OptinMonsterProps {
  userId: string;
  accountId: string;
}

export default function OptinMonster({ userId, accountId }: OptinMonsterProps) {
  React.useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // OptinMonster script
      (function(d: Document, u: string, ac: string) {
        const s = d.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://a.omappapi.com/app/js/api.min.js';
        s.async = true;
        (s as any).dataset.user = u;
        (s as any).dataset.account = ac;
        const firstScript = d.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(s, firstScript);
        }
      })(document, userId, accountId);
    }
  }, [userId, accountId]);

  return null;
} 