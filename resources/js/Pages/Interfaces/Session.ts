import { Schedule } from "./Schedule";

export interface Session {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    instructor: string;
    instructor_id: string | any;
    course_year_level: string;
    department_id: string;
    program_id: string;
    program_name: string;
    program_code: string;
    section: string;
    room: string;
    status: 'upcoming' | 'completed' | 'cancelled' ;
  }
  schedule: Schedule;
<<<<<<< HEAD
  session_date: Date;
=======
>>>>>>> cd892ce (feat(cancellation_request): Added cancellation request to instructors)
}
