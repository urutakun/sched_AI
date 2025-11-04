export interface Schedule {
  id: string;
  course_assignment_id: string;
  academic_year_id: string;
  trimester_id: string;
  department_id: string;
  room_id: string;
  days: string[];
  start_time: string;
  end_time: string;
  status: 'active' | 'pending_cancel' | 'cancelled' | 'completed';
}
