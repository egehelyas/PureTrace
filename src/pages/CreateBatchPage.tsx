import React from 'react';
import BatchForm from '../components/BatchForm'; // Path will be correct once BatchForm is in src/components

const CreateBatchPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px' }}>
      <BatchForm />
    </div>
  );
};

export default CreateBatchPage; 