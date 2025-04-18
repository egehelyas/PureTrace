import React from 'react';

const TimelineView = ({ events }) => {
  return (
    <div>
      <h2>Batch Timeline</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.date}</strong>: {event.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimelineView; 