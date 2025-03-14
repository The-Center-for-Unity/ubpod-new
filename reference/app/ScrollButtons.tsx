'use client';

import { useState, useEffect } from 'react';

export default function ScrollButtons() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition duration-300"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
      <button
        onClick={scrollToBottom}
        className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition duration-300"
        aria-label="Scroll to bottom"
      >
        ↓
      </button>
    </div>
  );
}
