import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define the expected structure for the API response
interface EventCreationResponse {
  id: string;
  event_type: string;
  description: string;
  timestamp: string;
  location: string;
  batch_id: string;
  created_at: string;
}

interface ApiErrorDetail {
  detail: string;
}

interface EventFormProps {
  batchId?: string; // Optional pre-filled batch ID
  onEventCreated?: (event: EventCreationResponse) => void; // Callback when event is created
}

const EventForm: React.FC<EventFormProps> = ({ batchId = '', onEventCreated }) => {
  const [searchParams] = useSearchParams();
  const [eventType, setEventType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [location, setLocation] = useState<string>('');
  const [currentBatchId, setCurrentBatchId] = useState<string>(batchId);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Pre-fill batch ID from URL query parameter
  useEffect(() => {
    const batchFromUrl = searchParams.get('batch');
    if (batchFromUrl && !batchId) {
      setCurrentBatchId(batchFromUrl);
    }
  }, [searchParams, batchId]);

  // Common event types for dropdown
  const eventTypes = [
    'Harvest',
    'Processing',
    'Quality Check',
    'Packaging',
    'Storage',
    'Transportation',
    'Distribution',
    'Retail',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          description: description,
          timestamp: timestamp ? timestamp.toISOString().split('T')[0] : '',
          location: location,
          batch_id: currentBatchId,
        }),
      });

      if (!response.ok) {
        const errorData: ApiErrorDetail = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: EventCreationResponse = await response.json();
      
      setSuccess(`Event "${data.event_type}" added successfully!`);
      
      // Call the callback if provided
      if (onEventCreated) {
        onEventCreated(data);
      }
      
      // Reset form (except batch ID if it was pre-filled)
      setEventType('');
      setDescription('');
      setTimestamp(null);
      setLocation('');
      if (!batchId) {
        setCurrentBatchId('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setTimestamp(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
        Add Lifecycle Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Batch ID Input */}
        <div>
          <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2">
            Batch ID
          </label>
          <input
            type="text"
            id="batchId"
            value={currentBatchId}
            onChange={(e) => setCurrentBatchId(e.target.value)}
            required
            disabled={!!batchId} // Disable if pre-filled
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!!batchId ? 'bg-gray-100' : ''}`}
            placeholder="Enter batch ID (e.g., 12345678-1234-1234-1234-123456789012)"
          />
        </div>

        {/* Event Type Dropdown */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select event type</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what happened in this step..."
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Processing Center A, Distribution Hub B"
          />
        </div>

        {/* Timestamp */}
        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <DatePicker
            id="timestamp"
            selected={timestamp}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Select event date"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Event...' : 'Add Event'}
        </button>
      </form>

      {success && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">✅ {success}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">❌ Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default EventForm; 