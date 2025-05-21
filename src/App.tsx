import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TracePage from './pages/TracePage';
import CreateBatchPage from './pages/CreateBatchPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '15px' }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create-batch">Create Batch</Link>
            </li>
            {/* Add other navigation links here if needed */}
          </ul>
        </nav>

        <hr style={{ display: 'none' }} /> {/* Visually hidden as nav has background and margin */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trace/:batchId" element={<TracePage />} />
          <Route path="/create-batch" element={<CreateBatchPage />} />
          {/* Define other routes here */}
        </Routes>
      </div>
    </Router>
  );
};

export default App; 