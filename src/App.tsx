import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import ScrollToTopOnNavigate from './components/utils/ScrollToTopOnNavigate';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/Home'));
const UrantiaPapersPage = React.lazy(() => import('./pages/UrantiaPapersPage'));
const EpisodePage = React.lazy(() => import('./pages/EpisodePage'));
const ListenPage = React.lazy(() => import('./pages/ListenPage'));
const DisclaimerPage = React.lazy(() => import('./pages/DisclaimerPage'));

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

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-navy-dark">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigate />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/urantia-papers" element={<UrantiaPapersPage />} />
          <Route path="/episode/:id" element={<EpisodePage />} />
          <Route path="/listen/:series/:id" element={<EpisodePage />} />
          <Route path="/listen/:series" element={<ListenPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;