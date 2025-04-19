import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

// Page animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

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