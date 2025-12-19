import { Student } from './Student';
import { Instructor } from './Instructor';
import { Dean } from './Dean';
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  dept_id: string;
  email: string;
  avatar: string;
  password: string;
  student: Student;
  instructor: Instructor;
  dean: Dean;
  instructor_type: 'full-time' | 'part-time';
}
