export interface Session {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    instructor: string;
    department_id: string;
    program_id: string;
    program_name: string;
    program_code: string;
    section: string;
    room: string;
    status: 'upcoming' | 'completed' | 'cancelled' ;
  }
}
