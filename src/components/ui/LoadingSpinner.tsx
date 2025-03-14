import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
} 