
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './views/Dashboard';
import ReadingView from './views/ReadingView';
import WritingView from './views/WritingView';
import SpeakingView from './views/SpeakingView';
import ListeningView from './views/ListeningView';

const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide global header for full-screen test modes to avoid layout conflicts
  const isTestView = ['/reading', '/listening', '/speaking'].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {!isTestView && (
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 px-8 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">LIVE PREP</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold">Alex Scholar</p>
                <p className="text-xs text-gray-500">IELTS Academic Track</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400"></div>
            </div>
          </header>
        )}
        
        <div className="flex-1 overflow-auto">
          <div className={`${isTestView ? '' : 'max-w-7xl mx-auto'}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reading" element={<ReadingView />} />
              <Route path="/writing" element={<WritingView />} />
              <Route path="/speaking" element={<SpeakingView />} />
              <Route path="/listening" element={<ListeningView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
