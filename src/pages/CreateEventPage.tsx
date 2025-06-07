import React from 'react';
import EventForm from '../components/EventForm';

const CreateEventPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '700px', margin: '20px auto', padding: '20px' }}>
      <EventForm />
    </div>
  );
};

export default CreateEventPage; 