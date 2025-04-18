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
    <div>
      <h2>Create a New Product Batch</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Origin:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Harvest Date:</label>
          <DatePicker
            selected={harvestDate}
            onChange={(date) => setHarvestDate(date)}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <button type="submit">Create Batch</button>
      </form>
      {batchId && <p>Batch created successfully! Batch ID: {batchId}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default BatchForm; 