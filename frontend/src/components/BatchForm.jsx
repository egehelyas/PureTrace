import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BatchForm = () => {
  const [productName, setProductName] = useState('');
  const [origin, setOrigin] = useState('');
  const [harvestDate, setHarvestDate] = useState(new Date());
  const [batchId, setBatchId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          origin,
          harvestDate: harvestDate.toISOString().split('T')[0],
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create batch');
      }
      const data = await response.json();
      setBatchId(data.batchId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
      <h2 className="text-2xl font-semibold mb-6 text-green-800 text-center">
        Create a New Product Batch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="form-input px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter product name"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Origin
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="form-input px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Enter origin location"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Harvest Date
            </label>
            <DatePicker
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
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Create Batch
        </button>
      </form>
      {batchId && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-medium">
            Batch created successfully! 
            <span className="block mt-1 text-sm">
              Batch ID: {batchId}
            </span>
          </p>
        </div>
      )}
      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default BatchForm; 