import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BatchForm = () => {
  const [productName, setProductName] = useState('');
  const [origin, setOrigin] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date());
  const [batchId, setBatchId] = useState(null);
  const [error, setError] = useState(null);
  const [traceUrl, setTraceUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBatchId(null);
    setTraceUrl('');

    try {
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: productName,
          origin,
          harvest_date: harvestDate.toISOString().split('T')[0],
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to create batch');
      }
      setBatchId(responseData.batch_id);
      setTraceUrl(responseData.trace_url);
      setProductName('');
      setOrigin('');
      setHarvestDate(new Date());
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-green-700 text-center">
        Create a New Product Batch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="productName" className="text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="form-input px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors placeholder-gray-400"
              placeholder="e.g., Organic Apples"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="origin" className="text-sm font-medium text-gray-600 mb-1">
              Origin
            </label>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="form-input px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors placeholder-gray-400"
              placeholder="e.g., Washington State"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="harvestDate" className="text-sm font-medium text-gray-600 mb-1">
              Harvest Date
            </label>
            <DatePicker
              id="harvestDate"
              selected={harvestDate}
              onChange={(date) => setHarvestDate(date)}
              dateFormat="yyyy-MM-dd"
              required
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Create Batch
        </button>
      </form>
      {batchId && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-medium">
            Batch created successfully! 
            <span className="block mt-1">
              Batch ID: {batchId}
            </span>
            {traceUrl && (
              <span className="block mt-1">
                Track here: <a href={traceUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">{traceUrl}</a>
              </span>
            )}
          </p>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default BatchForm; 