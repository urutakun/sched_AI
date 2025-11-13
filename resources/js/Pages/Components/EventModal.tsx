import React from 'react';

interface EventModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  event: {
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
    location: string;
    department?: {
      name: string;
    };
    status: string;
  } | null;
}

const EventModal = ({ isOpen, setIsOpen, event }: EventModalProps) => {
  if (!isOpen || !event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{event.title}</h2>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Time:</strong> {new Date(event.start_datetime).toLocaleString()} - {new Date(event.end_datetime).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        {event.department && <p><strong>Department:</strong> {event.department.name}</p>}
        <p><strong>Status:</strong> {event.status}</p>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
    </div>
  );
};

export default EventModal;