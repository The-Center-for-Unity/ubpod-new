import { track as vercelTrack } from '@vercel/analytics';

/**
 * Track an event with analytics
 * @param name Event name
 * @param properties Event properties
 */
export function track(name: string, properties?: Record<string, any>) {
  // Track with Vercel Analytics
  vercelTrack(name, properties);
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics]`, name, properties);
  }
  
  // Add any additional analytics services here
} 