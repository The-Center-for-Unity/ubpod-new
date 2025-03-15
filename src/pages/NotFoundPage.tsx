import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="title-main text-4xl mb-6">Page Not Found</h1>
        <p className="body-lg mb-8 max-w-2xl mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gold text-navy rounded-full
                    hover:bg-gold-light transition-all duration-300 btn-text"
        >
          Return to Home
        </Link>
      </div>
    </Layout>
  );
} 