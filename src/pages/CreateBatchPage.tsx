import React from 'react';
import BatchForm from '../components/BatchForm.tsx'; // Explicitly import the TypeScript version

const CreateBatchPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px' }}>
      <BatchForm />
    </div>
  );
};

export default CreateBatchPage; 