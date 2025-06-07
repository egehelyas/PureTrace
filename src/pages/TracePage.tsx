import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Define a type for lifecycle events
interface LifecycleEvent {
  id: string;
  eventName: string; // e.g., "Harvested", "Processed", "Packaged", "Shipped"
  timestamp: string; // ISO 8601 date-time string
  location?: string;
  notes?: string;
  isBlockchainVerified?: boolean;
  transactionUrl?: string;
}

// Define a type for the expected batch data structure
interface BatchData {
  id: string; // This is our batchId
  productName: string;
  origin?: string; // e.g., "Green Valley Farm"
  harvestDate?: string; // ISO 8601 date string
  processingDate?: string; // ISO 8601 date string
  packagingDate?: string; // ISO 8601 date string
  bestBeforeDate?: string; // ISO 8601 date string
  imageUrl?: string; // URL to an image of the product/batch
  description?: string;
  lifecycleEvents: LifecycleEvent[];
}

const TracePage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batchData, setBatchData] = useState<BatchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulating API call delay
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, fetch from your API endpoint:
        const response = await fetch(`http://127.0.0.1:8000/batch/${batchId}`);
        if (!response.ok) {
          // If the API returns a specific error message, use it
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();
        
        // Transform the API response to match our frontend interface
        const data: BatchData = {
          id: apiData.id,
          productName: apiData.product_name,
          origin: apiData.origin,
          harvestDate: apiData.harvest_date,
          lifecycleEvents: apiData.events?.map((event: any) => ({
            id: event.id,
            eventName: event.event_type,
            timestamp: event.timestamp,
            location: event.location,
            notes: event.description,
            isBlockchainVerified: false // Default for now
          })) || []
        };
        setBatchData(data);
      } catch (e: any) {
        setError(e.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch (e) {
      return dateTimeString;
    }
  };

  if (loading) {
    return <div className="p-5 text-center text-lg">Loading batch data...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-600 text-center text-lg">Error fetching data: {error}</div>;
  }

  if (!batchData) {
    return <div className="p-5 text-center text-lg">No data found for batch ID: {batchId}</div>;
  }

  return (
    <div className="font-sans max-w-4xl mx-auto p-5 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="p-6 bg-white rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Product Journey</h1>
        <p className="text-md text-gray-600 mb-6">Trace the journey of this product from origin to you.</p>
        
        <h2 className="text-4xl font-bold text-green-700 mb-2">{batchData.productName}</h2>
        {batchData.origin && <p className="text-xl text-gray-700 mb-6">{batchData.origin}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
            <div>
                <span className="font-semibold text-gray-700">Batch ID: </span> 
                <span className="text-gray-600">{batchData.id}</span>
            </div>
            <div>
                <span className="font-semibold text-gray-700">Harvest Date: </span>
                <span className="text-gray-600">{formatDate(batchData.harvestDate)}</span>
            </div>
            {batchData.processingDate && (
                 <div>
                    <span className="font-semibold text-gray-700">Processing Date: </span>
                    <span className="text-gray-600">{formatDate(batchData.processingDate)}</span>
                </div>
            )}
            {batchData.packagingDate && (
                 <div>
                    <span className="font-semibold text-gray-700">Packaging Date: </span>
                    <span className="text-gray-600">{formatDate(batchData.packagingDate)}</span>
                </div>
            )}
             {batchData.bestBeforeDate && (
                 <div>
                    <span className="font-semibold text-gray-700">Best Before: </span>
                    <span className="text-gray-600">{formatDate(batchData.bestBeforeDate)}</span>
                </div>
            )}
        </div>
        {batchData.description && <p className="text-gray-600 leading-relaxed mb-6">{batchData.description}</p>}
         {batchData.imageUrl && (
            <div className="mt-6 text-center">
            <img 
                src={batchData.imageUrl} 
                alt={batchData.productName} 
                className="max-w-full max-h-80 rounded-lg shadow-md inline-block"
            />
            </div>
        )}
      </section>

      {/* Timeline Section */}
      <section className="p-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Timeline</h2>
          <Link
            to={`/add-event?batch=${batchData.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            📋 Add Event
          </Link>
        </div>
        {batchData.lifecycleEvents && batchData.lifecycleEvents.length > 0 ? (
          <div className="relative">
            {/* The vertical line */}
            <div className="hidden sm:block absolute w-0.5 h-full bg-gray-300 left-5 top-2 transform -translate-x-1/2"></div>

            {batchData.lifecycleEvents
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((event, index, arr) => (
              <div key={event.id} className="relative pl-12 pb-8 last:pb-0">
                 {/* Timeline Dot - larger and with conditional color */}
                <div 
                  className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm transform -translate-x-1/2 shadow-md ${event.isBlockchainVerified ? 'bg-green-500' : 'bg-blue-500'}`}
                >
                  {event.eventName.charAt(0).toUpperCase()}
                </div>
                
                {/* Event Content Card */}
                <div className="ml-2 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{event.eventName}</h3>
                    <p className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full mt-1 sm:mt-0">
                      {formatDateTime(event.timestamp)}
                    </p>
                  </div>
                  {event.location && <p className="text-sm text-gray-600 mb-1">Location: {event.location}</p>}
                  {event.notes && <p className="text-sm text-gray-600 mb-2">{event.notes}</p>}
                  
                  {event.isBlockchainVerified && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center text-sm text-green-600">
                        <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                        Blockchain Verified
                        {event.transactionUrl && (
                          <a 
                            href={event.transactionUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="ml-auto text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                          >
                            View Transaction &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No lifecycle events recorded for this batch.</p>
        )}
      </section>
    </div>
  );
};

export default TracePage; 