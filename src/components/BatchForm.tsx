import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { QRCodeSVG } from 'qrcode.react';

// Define the expected structure for the API response
interface BatchCreationResponse {
  batch_id: string;
  trace_url: string;
  product_name: string;
  origin: string;
  harvest_date: string;
}

interface ApiErrorDetail {
  detail: string;
}

const BatchForm: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [harvestDate, setHarvestDate] = useState<Date | null>(null);
  const [batchId, setBatchId] = useState<string>('');
  const [traceUrl, setTraceUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: productName,
          origin: origin,
          harvest_date: harvestDate ? harvestDate.toISOString().split('T')[0] : '',
        }),
      });

      if (!response.ok) {
        const errorData: ApiErrorDetail = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: BatchCreationResponse = await response.json();
      setBatchId(data.batch_id);
      setTraceUrl(data.trace_url);
      
      // Reset form
      setProductName('');
      setOrigin('');
      setHarvestDate(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create batch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setHarvestDate(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-green-700 text-center">
        Create a New Product Batch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Organic Tomatoes"
          />
        </div>

        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
            Origin
          </label>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Green Valley Farm, California"
          />
        </div>

        <div>
          <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-2">
            Harvest Date
          </label>
          <DatePicker
            id="harvestDate"
            selected={harvestDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholderText="Select harvest date"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Batch...' : 'Create Batch'}
        </button>
      </form>

      {batchId && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
          <p className="text-lg text-green-800 font-semibold mb-3">
            Batch Created Successfully!
          </p>
          <p className="text-sm text-gray-700 mb-1">
            <strong>Batch ID:</strong> {batchId}
          </p>
          {traceUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Traceable QR Code:</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <QRCodeSVG value={traceUrl} size={128} bgColor={"#ffffff"} fgColor={"#000000"} level={"Q"} />
              </div>
              <p className="text-sm text-gray-700">
                Track here: <a href={traceUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 underline">{traceUrl}</a>
              </p>
            </div>
          )}
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