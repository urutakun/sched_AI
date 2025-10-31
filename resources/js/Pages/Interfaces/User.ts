import { Student } from './Student';
import { Instructor } from './Instructor';
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  avatar: string; 
  password: string;
  student: Student;
  instructor: Instructor;
}
