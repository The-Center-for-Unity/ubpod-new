import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load pages for better initial bundle size
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DisclaimerPage = React.lazy(() => import('./pages/DisclaimerPage'));
const UrantiaPapersPage = React.lazy(() => import('./pages/UrantiaPapersPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/urantia-papers" element={<UrantiaPapersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Analytics />
    </Router>
  );
}

export default App;