/**
 * i18nRouteUtils.ts
 * Utility functions for handling internationalized routes
 */

/**
 * Gets a localized path for any route
 * @param path - The original path
 * @param language - The target language code
 * @returns The localized path
 */
export function getLocalizedPath(path: string, language: string): string {
  // If language is English (default), return the original path
  if (language === 'en') return path;
  
  // Otherwise, prefix the path with the language code
  // Handle paths that already have a language prefix
  if (path.match(/^\/[a-z]{2}\//)) {
    return path.replace(/^\/[a-z]{2}\//, `/${language}/`);
  }
  
  // Handle root path
  if (path === '/') {
    return `/${language}`;
  }
  
  // Handle regular paths
  return `/${language}${path}`;
}

/**
 * Extracts the language code from a path
 * @param path - The path to parse
 * @returns The language code, or 'en' if none found
 */
export function getLanguageFromPath(path: string): string {
  const match = path.match(/^\/([a-z]{2})\//);
  return match && ['es', 'fr', 'pt', 'ru', 'ro', 'de'].includes(match[1]) ? match[1] : 'en';
}

/**
 * Removes the language prefix from a path
 * @param path - The path with possible language prefix
 * @returns The path without language prefix
 */
export function removeLanguageFromPath(path: string): string {
  return path.replace(/^\/[a-z]{2}(\/|$)/, '/');
}

/**
 * Generates alternate language URLs for the same page
 * @param path - The current path
 * @param baseUrl - The base URL of the site (optional)
 * @returns An object with language codes as keys and full URLs as values
 */
export function getLanguageAlternates(path: string, baseUrl: string = 'https://ubpod.org'): Record<string, string> {
  // Remove any existing language code from the path
  const basePath = removeLanguageFromPath(path);
  
  // Generate URLs for each supported language
  return {
    en: `${baseUrl}${basePath}`,
    es: `${baseUrl}/es${basePath}`,
    fr: `${baseUrl}/fr${basePath}`,
    pt: `${baseUrl}/pt${basePath}`,
    ro: `${baseUrl}/ro${basePath}`,
    ru: `${baseUrl}/ru${basePath}`,
    de: `${baseUrl}/de${basePath}`,
  };
}