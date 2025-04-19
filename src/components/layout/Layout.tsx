import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

/**
 * Props interface for the Layout component
 * 
 * @interface LayoutProps
 * @property {ReactNode} children - Child components to be rendered within the layout
 * @property {string} [className] - Optional additional CSS classes to apply to the main content area
 */
interface LayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Animation variants for page transitions
 * Defines the initial, animate, and exit states for the page content
 */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

/**
 * Layout Component
 * 
 * A consistent layout wrapper that provides the standard page structure
 * including header, main content area with animations, footer, and scroll-to-top functionality.
 * 
 * @component
 * @param {LayoutProps} props - Component props
 * @param {ReactNode} props.children - Content to render inside the layout
 * @param {string} [props.className=''] - Additional CSS classes for the main content
 * @returns {JSX.Element} Complete page layout with animated content area
 */
export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col">
      <Header />
      <motion.main
        className={`flex-grow py-20 ${className}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
      <Footer />
      <ScrollToTop />
    </div>
  );
} 