import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import ScrollToTopOnNavigate from './components/utils/ScrollToTopOnNavigate';
import HotjarAnalytics from './components/analytics/HotjarAnalytics';
import OptinMonster from './components/analytics/OptinMonster';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/Home'));
const UrantiaPapersPage = React.lazy(() => import('./pages/UrantiaPapersPage'));
const EpisodePage = React.lazy(() => import('./pages/EpisodePage'));
const ListenPage = React.lazy(() => import('./pages/ListenPage'));
const DisclaimerPage = React.lazy(() => import('./pages/DisclaimerPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const SeriesPage = React.lazy(() => import('./pages/SeriesPage'));
const DebugPage = React.lazy(() => import('./pages/Debug'));

// Analytics IDs
const HOTJAR_ID = '5205817';
const OPTINMONSTER_USER_ID = '345457';
const OPTINMONSTER_ACCOUNT_ID = '365360';

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
          
          {/* Series routes - both old and new formats */}
          <Route path="/listen/:series/:id" element={<EpisodePage />} />
          <Route path="/listen/:series" element={<ListenPage />} />
          
          {/* New series routes */}
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/series/:seriesId" element={<ListenPage />} />
          <Route path="/series/:seriesId/:episodeId" element={<EpisodePage />} />
          
          {/* Other pages */}
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Analytics />
      <HotjarAnalytics HOTJAR_ID={HOTJAR_ID} />
      <OptinMonster userId={OPTINMONSTER_USER_ID} accountId={OPTINMONSTER_ACCOUNT_ID} />
    </BrowserRouter>
  );
}

export default App;