import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchId.trim()) {
      navigate(`/trace/${batchId.trim()}`);
    }
  };

  const handleNavigateToCreateBatch = () => {
    navigate('/create-batch');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div>
          {/* Optional: You can add a logo here if you have one */}
          {/* <img className="mx-auto h-12 w-auto" src="/path-to-your-logo.png" alt="PureTrace" /> */}
          <h1 className="mt-6 text-5xl font-extrabold text-green-700">
            PureTrace
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Follow your product's journey with complete transparency.
          </p>
          <p className="mt-2 text-md text-gray-500">
            Enter a batch ID below to see its lifecycle from origin to you.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="batch-id" className="sr-only">
                Batch ID
              </label>
              <input
                id="batch-id"
                name="batchId"
                type="text"
                autoComplete="off"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter Batch ID"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Track Product
            </button>
          </div>
        </form>

        <div className="mt-10">
          <p className="text-sm text-gray-600">
            Are you a producer?
          </p>
          <button
            onClick={handleNavigateToCreateBatch}
            className="mt-2 font-medium text-green-600 hover:text-green-700 hover:underline"
          >
            Create a new Product Batch &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 