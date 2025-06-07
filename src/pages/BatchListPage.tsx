import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

interface BatchSummary {
  id: string;
  product_name: string;
  origin: string;
  harvest_date: string;
  created_at: string;
  events: any[];
}

const BatchListPage: React.FC = () => {
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Note: This would require a backend endpoint to list all batches
  // For now, we'll show a placeholder since we don't have a list endpoint
  useEffect(() => {
    // TODO: Implement when backend has a list batches endpoint
    // fetchBatches();
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Batches</h1>
        <p className="mt-2 text-gray-600">View and manage your product batches</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">❌ Error: {error}</p>
        </div>
      )}

      {/* Placeholder content */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Batch List Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          This feature requires a backend endpoint to list all batches. For now, you can:
        </p>
        <div className="space-y-2 text-left max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✓</span>
            <span>Create new batches</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✓</span>
            <span>Add events to existing batches</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✓</span>
            <span>View batch traces using QR codes or direct URLs</span>
          </div>
        </div>
        <div className="mt-6 space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Create New Batch
          </Link>
          <Link
            to="/add-event"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Add Event
          </Link>
        </div>
      </div>

      {/* Example of what the batch list would look like */}
      {batches.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {batch.product_name}
                  </h3>
                  <p className="text-sm text-gray-600">{batch.origin}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(batch.created_at)}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Harvest:</strong> {formatDate(batch.harvest_date)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Events:</strong> {batch.events?.length || 0}
                </p>
              </div>

              <div className="flex justify-center mb-4">
                <QRCodeSVG 
                  value={`${window.location.origin}/trace/${batch.id}`} 
                  size={80} 
                  bgColor={"#ffffff"} 
                  fgColor={"#000000"} 
                  level={"Q"} 
                />
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/trace/${batch.id}`}
                  className="flex-1 text-center bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-green-700"
                >
                  View Trace
                </Link>
                <Link
                  to={`/add-event?batch=${batch.id}`}
                  className="flex-1 text-center bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Add Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchListPage; 