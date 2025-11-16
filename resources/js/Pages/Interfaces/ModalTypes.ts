export interface SessionModalEvent {
  title: string;
  eventType: 'session';
  extendedProps: {
    instructor: string;
    room: string;
    program_name: string;
    section: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  };
}

export interface EventModal {
  title: string;
  eventType: 'event';
  extendedProps: {
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    description: string;
    location: string;
    start: Date;
    end: Date;
  };
}

export type ModalSession = SessionModalEvent | EventModal;
