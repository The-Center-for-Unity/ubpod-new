import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Props interface for the MetaTags component
 * 
 * @interface MetaTagsProps
 * @property {string} title - The title for the page (also used in meta tags)
 * @property {string} description - The description for the page (used in meta tags)
 * @property {string} [imageUrl] - Optional image URL for social sharing (OpenGraph/Twitter)
 * @property {string} [url] - Optional canonical URL for the page
 * @property {'website' | 'article'} [type] - Content type for OpenGraph tags
 */
interface MetaTagsProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: 'website' | 'article';
}

/**
 * MetaTags Component
 * 
 * A component that manages all meta tags for SEO and social sharing.
 * Uses react-helmet-async to inject tags into the document head.
 * Includes OpenGraph tags for Facebook and Twitter card tags.
 * 
 * @component
 * @param {MetaTagsProps} props - Component props
 * @returns {JSX.Element} Helmet component with all meta tags
 * 
 * @example
 * // Basic usage
 * <MetaTags
 *   title="Episode 42 - The Universe of Universes"
 *   description="Explore the cosmic structure in this episode of UrantiaBookPod"
 * />
 * 
 * @example
 * // With custom image and URL
 * <MetaTags
 *   title="Home | UrantiaBookPod"
 *   description="Audio podcast experience for exploring the Urantia Book"
 *   imageUrl="https://example.com/custom-image.jpg"
 *   url="https://urantiabookpod.com"
 *   type="website"
 * />
 */
export default function MetaTags({ 
  title, 
  description, 
  imageUrl = 'https://www.urantiabookpod.com/og-image.png',
  url,
  type = 'article'
}: MetaTagsProps) {
  // Set canonical URL to current page if not provided
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
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