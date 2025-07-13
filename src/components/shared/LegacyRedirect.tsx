import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

/**
 * LegacyRedirect Component
 * 
 * Handles backward compatibility for legacy URLs shared on social media:
 * - /listen/cosmic-X/Y → /series/cosmic-X/Y
 * - /listen/jesus-X/Y → /series/jesus-X/Y  
 * - /listen/urantia-papers/X → /urantia-papers/X
 * - /listen/discover-jesus/X → /series/jesus-1/X (map to first Jesus series)
 * - /listen/sadler-workbooks/X → /urantia-papers/X (map to unified Urantia Papers)
 */
export default function LegacyRedirect() {
  const { series, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!series || !id) {
      // Invalid URL, redirect to home
      navigate('/', { replace: true });
      return;
    }

    // Determine the correct new URL based on series type
    let newUrl: string;

    if (series === 'urantia-papers') {
      // /listen/urantia-papers/X → /series/urantia-papers/X
      newUrl = `/series/urantia-papers/${id}`;
    } else if (series.startsWith('cosmic-') || series.startsWith('jesus-')) {
      // /listen/cosmic-X/Y → /series/cosmic-X/Y
      // /listen/jesus-X/Y → /series/jesus-X/Y
      newUrl = `/series/${series}/${id}`;
    } else if (series === 'discover-jesus') {
      // /listen/discover-jesus/X → /series/jesus-1/X (map to first Jesus series)
      newUrl = `/series/jesus-1/${id}`;
    } else if (series === 'sadler-workbooks') {
      // /listen/sadler-workbooks/X → /urantia-papers/X (map to unified Urantia Papers)
      newUrl = `/series/urantia-papers/${id}`;
    } else {
      // Unknown series, try mapping to series format
      newUrl = `/series/${series}/${id}`;
    }

    // Handle language prefix if present
    const isSpanish = location.pathname.startsWith('/es/');
    if (isSpanish) {
      newUrl = `/es${newUrl}`;
    }

    console.log(`[LegacyRedirect] Redirecting from ${location.pathname} to ${newUrl}`);
    
    // Perform the redirect using window.location to force a full page load
    // This can be more reliable in some hosting environments than router.navigate()
    window.location.replace(newUrl);

  }, [series, id, location.pathname]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Redirecting...</p>
      </div>
    </div>
  );
} 