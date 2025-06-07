import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import TracePage from './pages/TracePage';
import CreateBatchPage from './pages/CreateBatchPage';
import CreateEventPage from './pages/CreateEventPage';
import BatchListPage from './pages/BatchListPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={<CreateBatchPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/trace/:batchId" element={<TracePage />} />
            <Route path="/create-batch" element={<CreateBatchPage />} />
            <Route path="/add-event" element={<CreateEventPage />} />
            <Route path="/batches" element={<BatchListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 