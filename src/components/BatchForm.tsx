import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { QRCodeSVG } from 'qrcode.react';

// Define the expected structure for the API response (if known)
interface BatchCreationResponse {
  // ... existing code ...
  interface ApiErrorDetail {
    detail: string;
  }
}

const BatchForm: React.FC = () => {
  // ... (state variables remain the same) ...
  const [traceUrl, setTraceUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... (handleSubmit function remains the same) ...
  };

  // ... (handleDateChange functions remain the same) ...

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-green-700 text-center">
        Create a New Product Batch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... (all form input divs) ... */}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Create Batch
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