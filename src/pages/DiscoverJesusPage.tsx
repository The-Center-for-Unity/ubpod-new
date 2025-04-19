import React from 'react';
import Layout from '../components/layout/Layout';

export default function DiscoverJesusPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <h1 className="title-main text-center mb-8">Discover Jesus</h1>
        <div className="max-w-3xl mx-auto bg-navy-light/30 rounded-xl p-8 border border-white/10">
          <p className="body-lg mb-6">
            This section is currently under development. Soon, you'll be able to explore the life and teachings of Jesus as presented in the Urantia Book.
          </p>
          <p className="body-lg">
            Check back later for audio narrations, study guides, and interactive content focused on Part IV of the Urantia Book: "The Life and Teachings of Jesus."
          </p>
        </div>
      </div>
    </Layout>
  );
} 