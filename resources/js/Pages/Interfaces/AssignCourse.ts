export interface AssignCourse {
  id: string;
  course_id: string;
  instructor_id: string;
  status: 'active' | 'inactive';
}
