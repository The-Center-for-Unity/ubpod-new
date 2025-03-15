import { track as vercelTrack } from '@vercel/analytics';

/**
 * Track an event with analytics
 * @param name Event name
 * @param properties Event properties
 */
export function track(name: string, properties?: Record<string, any>) {
  // Track with Vercel Analytics
  vercelTrack(name, properties);
  
  // Track with Google Analytics
  if (window.gtag) {
    window.gtag('event', name, properties);
  }
  
  // Track with Google Tag Manager
  if (window.dataLayer) {
    window.dataLayer.push({
      event: name,
      ...properties
    });
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics]`, name, properties);
  }
  
  // Add any additional analytics services here
} 