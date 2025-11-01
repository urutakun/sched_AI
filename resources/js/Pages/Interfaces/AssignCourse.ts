import { Course } from "./Course";
import { Instructor } from "./Instructor";

export interface AssignCourse {
  id: string;
  course_id: string;
  instructor_id: string;
  status: 'active' | 'inactive';
  course: Course;
  instructor: Instructor;
}
