import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages for better performance
const UrantiaPapersPage = React.lazy(() => import('./pages/UrantiaPapersPage'));
const EpisodePage = React.lazy(() => import('./pages/EpisodePage'));

// Placeholder components until we implement the actual pages
const HomePage = () => (
  <div className="min-h-screen flex items-center justify-center bg-navy-dark">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4 text-white">Welcome to UrantiaBookPod</h1>
      <p className="mb-6 text-white/70">The audio podcast experience for exploring the Urantia Book</p>
      <div className="flex justify-center">
        <a href="/urantia-papers" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
          Explore Papers
        </a>
      </div>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-navy-dark">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4 text-white">404 - Page Not Found</h1>
      <p className="mb-6 text-white/70">The page you are looking for does not exist.</p>
      <a href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/urantia-papers" element={<UrantiaPapersPage />} />
          <Route path="/episode/:id" element={<EpisodePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;