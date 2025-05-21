import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        const response = await fetch(`/api/batch/${batchId}`);
        if (!response.ok) {
          // If the API returns a specific error message, use it
          // const errorData = await response.json().catch(() => null);
          // throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: BatchData = await response.json();
        setBatchData(data);
      } catch (e: any) {
        setError(e.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchId]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2em' }}>Loading batch data...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center', fontSize: '1.2em' }}>Error fetching data: {error}</div>;
  }

  if (!batchData) {
    return <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2em' }}>No data found for batch ID: {batchId}</div>;
  }

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
  
  // Styles (can be moved to a CSS file for larger applications)
  const styles = {
    pageContainer: { fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' },
    headerSection: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    mainTitle: { fontSize: '1.8em', fontWeight: 'bold', color: '#222', margin: '0 0 5px 0' },
    subtitle: { fontSize: '1em', color: '#666', margin: '0 0 20px 0' }, 
    productName: { fontSize: '2em', fontWeight: 'bold', color: '#333', marginBottom: '5px' },
    productOrigin: { fontSize: '1.2em', color: '#555', marginBottom: '20px' },
    detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
    detailItem: { fontSize: '1em' },
    detailLabel: { fontWeight: 'bold', color: '#444' }, 
    timelineSection: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    timelineTitle: { fontSize: '1.8em', fontWeight: 'bold', color: '#222', marginBottom: '25px' },
    timelineList: { listStyle: 'none', padding: 0, position: 'relative' as 'relative' }, // Added as 'relative' for TS
    timelineItem: {
      paddingLeft: '40px', 
      position: 'relative' as 'relative', 
      paddingBottom: '25px', 
      borderLeft: '2px solid #e0e0e0',
      marginLeft: '15px' // to align with the circle
    },
    timelineDot: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: '#60a5fa', // Example color, can be dynamic
      position: 'absolute' as 'absolute',
      left: '-16px', // (30px + 2px border) / 2
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.9em'
    },
    eventContent: { marginLeft: '10px' }, // To give some space after the dot/line
    eventName: { fontSize: '1.2em', fontWeight: 'bold', color: '#333', marginBottom: '3px' },
    eventTime: { fontSize: '0.9em', color: '#555', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginLeft: '8px' },
    eventDetails: { fontSize: '1em', color: '#666', margin: '5px 0' },
    blockchainStatus: { marginTop: '10px', display: 'flex', alignItems: 'center', fontSize: '0.9em', color: '#28a745' },
    blockchainIcon: { marginRight: '5px', color: '#28a745' }, // Placeholder for an icon
    transactionLink: { marginLeft: '15px', color: '#007bff', textDecoration: 'none' }
  };

  // Get first letter for the timeline dot
  const getInitial = (name?: string) => name ? name.charAt(0).toUpperCase() : '';

  return (
    <div style={styles.pageContainer}>
      <section style={styles.headerSection}>
        <h1 style={styles.mainTitle}>Product Journey</h1>
        <p style={styles.subtitle}>Trace the journey of this product from origin to you</p>
        <h2 style={styles.productName}>{batchData.productName}</h2>
        {batchData.origin && <p style={styles.productOrigin}>{batchData.origin}</p>}
        
        <div style={styles.detailGrid}>
            <div>
                <span style={styles.detailLabel}>Batch ID: </span> 
                <span style={styles.detailItem}>{batchData.id}</span>
            </div>
            <div>
                <span style={styles.detailLabel}>Harvest Date: </span>
                <span style={styles.detailItem}>{formatDate(batchData.harvestDate)}</span>
            </div>
            {batchData.processingDate && (
                 <div>
                    <span style={styles.detailLabel}>Processing Date: </span>
                    <span style={styles.detailItem}>{formatDate(batchData.processingDate)}</span>
                </div>
            )}
            {batchData.packagingDate && (
                 <div>
                    <span style={styles.detailLabel}>Packaging Date: </span>
                    <span style={styles.detailItem}>{formatDate(batchData.packagingDate)}</span>
                </div>
            )}
             {batchData.bestBeforeDate && (
                 <div>
                    <span style={styles.detailLabel}>Best Before: </span>
                    <span style={styles.detailItem}>{formatDate(batchData.bestBeforeDate)}</span>
                </div>
            )}
        </div>
        {batchData.description && <p style={{color: '#666', lineHeight: '1.6'}}>{batchData.description}</p>}
         {batchData.imageUrl && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <img 
                src={batchData.imageUrl} 
                alt={batchData.productName} 
                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            />
            </div>
        )}
      </section>

      <section style={styles.timelineSection}>
        <h2 style={styles.timelineTitle}>Timeline</h2>
        {batchData.lifecycleEvents && batchData.lifecycleEvents.length > 0 ? (
          <ul style={styles.timelineList}>
            {batchData.lifecycleEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((event, index, arr) => (
              <li key={event.id} style={{...styles.timelineItem, ...(index === arr.length - 1 ? { borderLeft: '2px solid transparent' } : {})}}>
                <div style={{...styles.timelineDot, backgroundColor: event.isBlockchainVerified ? '#28a745' : '#60a5fa' }}>{getInitial(event.eventName)}</div>
                <div style={styles.eventContent}>
                  <span style={styles.eventName}>{event.eventName}</span>
                  <span style={styles.eventTime}>{formatDateTime(event.timestamp)}</span>
                  {event.notes && <p style={styles.eventDetails}>{event.notes}</p>}
                  {event.location && <p style={styles.eventDetails}>Location: {event.location}</p>}
                  {event.isBlockchainVerified && (
                    <div style={styles.blockchainStatus}>
                      <span style={styles.blockchainIcon}>✓</span> {/* Simple check icon */}
                      Blockchain Verified
                      {event.transactionUrl && (
                        <a href={event.transactionUrl} target="_blank" rel="noopener noreferrer" style={styles.transactionLink}>
                          View Transaction ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#666' }}>No lifecycle events recorded for this batch.</p>
        )}
      </section>
    </div>
  );
};

export default TracePage; 