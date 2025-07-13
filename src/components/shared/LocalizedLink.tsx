import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedPath } from '../../utils/i18nRouteUtils';

/**
 * Props for the LocalizedLink component
 * Extends React Router's LinkProps but makes 'to' required
 */
interface LocalizedLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  skipLocalization?: boolean;
}

/**
 * A wrapper around React Router's Link component that automatically
 * adds language prefixes to paths based on the current language
 */
export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ 
  to, 
  skipLocalization = false,
  ...props 
}) => {
  const { language } = useLanguage();
  
  // Apply localization unless explicitly skipped
  const localizedTo = skipLocalization ? to : getLocalizedPath(to, language);
  
  return <Link to={localizedTo} {...props} />;
};